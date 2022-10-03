import { Queue, Worker, QueueScheduler } from "bullmq";
import IORedis from "ioredis";
import { Drone } from "../models/Drone";
import { DroneState, JobQueue } from "../util/constants";
import {
  getAllDrones,
  offloadDroneCargo,
  setDroneBatteryPercent,
  setDroneState,
} from "./DispatchService";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";

const connection = new IORedis("redis://redis:6379");
new QueueScheduler(JobQueue.SIMULATION, { connection });

const auditQueue = new Queue(JobQueue.AUDIT_LOG, { connection });
const simulationQueue = new Queue(JobQueue.SIMULATION, { connection });

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
createBullBoard({
  queues: [
    new BullAdapter(auditQueue),
    new BullAdapter(simulationQueue),
  ],
  serverAdapter: serverAdapter,
});

new Worker(
  JobQueue.SIMULATION,
  async (job) => {
    /**
     * - Move drones in LOADED state to DELIVERING & Reduce drone battery by 5%
     * - Move drones in DELIVERING to DELIVERED & Reduce drone battery by 5%
     * - Move drones in DELIVERED to RETURNING & Reduce drone battery by 5%
     * - Move drones in RETURNING to IDLE
     * - Set drones in IDLE to 100%
     */
    const drones = await getAllDrones();

    drones.map(async (drone: Drone) => {
      switch (drone.STATE) {
        case DroneState.IDLE:
          if (drone.BATTERY_PERCENTAGE != 100) {
            await setDroneBatteryPercent(100, drone.SERIAL_NUMBER);
          }
          break;
        case DroneState.LOADED:
          await setDroneState("4", drone.SERIAL_NUMBER);
          await setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 15,
            drone.SERIAL_NUMBER
          );
          break;
        case DroneState.DELIVERING:
          await setDroneState("5", drone.SERIAL_NUMBER);
          await setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 25,
            drone.SERIAL_NUMBER
          );
          break;
        case DroneState.DELIVERED:
          await offloadDroneCargo(drone.SERIAL_NUMBER);
          await setDroneState("6", drone.SERIAL_NUMBER);
          await setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 15,
            drone.SERIAL_NUMBER
          );
          break;
        case DroneState.RETURNING:
          await setDroneState("1", drone.SERIAL_NUMBER);
          await setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 25,
            drone.SERIAL_NUMBER
          );
          break;
      }
    });
  },
  { connection }
);

new Worker(
  JobQueue.AUDIT_LOG,
  async (job) => {
    /**
     * TO-DO
     * - Log state change on a drone
     * - Log medication load onto a drone
     * - Log battery below 25% on a drone
     */
  },
  { connection }
);

simulationQueue.add(
  JobQueue.SIMULATION,
  { name: JobQueue.SIMULATION },
  { repeat: { every: 1000 * 60 } }
);

export { auditQueue, simulationQueue, serverAdapter };
