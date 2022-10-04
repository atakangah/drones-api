import { Queue, Worker, QueueScheduler } from "bullmq";
import IORedis from "ioredis";
import { Drone } from "../models/Drone";
import { DbDroneState, DroneState, JobQueue } from "../types/db-constants";
import { arrToString } from "../util/converters";
import { REDIS_SERVER } from "../util/secrets";
import {
  getAllDrones,
  log,
  offloadDroneCargo,
  queryDroneCargo,
  setDroneBatteryPercent,
  setDroneState,
} from "./DispatchService";

const SIMULATION_INTERVAL = 1000 * 60 * 3;
const AUDIT_LOG_INTERVAL = 1000 * 60 * 3.5;

const connection = new IORedis(REDIS_SERVER);
new QueueScheduler(JobQueue.SIMULATION, { connection });
new QueueScheduler(JobQueue.AUDIT_LOG, { connection });

const auditQueue = new Queue(JobQueue.AUDIT_LOG, { connection });
const simulationQueue = new Queue(JobQueue.SIMULATION, { connection });

new Worker(
  JobQueue.SIMULATION,
  async () => {
    /**
     * - Move drones in LOADED state to DELIVERING & Reduce drone battery by 5%
     * - Move drones in DELIVERING to DELIVERED & Reduce drone battery by 5%
     * - Move drones in DELIVERED to RETURNING & Reduce drone battery by 5%
     * - Move drones in RETURNING to IDLE
     * - Set drones in IDLE to 100%
     */
    const drones = await getAllDrones();

    const auditLogs = drones.map(async (drone: Drone) => {
      switch (drone.STATE) {
        case DroneState.IDLE:
          if (drone.BATTERY_PERCENTAGE != 100) {
            await setDroneBatteryPercent(100, drone.SERIAL_NUMBER);
          }
          break;
        case DroneState.LOADED:
          await setDroneState(DbDroneState.DELIVERING, drone.SERIAL_NUMBER);
          await setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 15,
            drone.SERIAL_NUMBER
          );
          break;
        case DroneState.DELIVERING:
          await setDroneState(DbDroneState.DELIVERED, drone.SERIAL_NUMBER);
          await setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 25,
            drone.SERIAL_NUMBER
          );
          break;
        case DroneState.DELIVERED:
          await offloadDroneCargo(drone.SERIAL_NUMBER);
          await setDroneState(DbDroneState.RETURNING, drone.SERIAL_NUMBER);
          await setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 15,
            drone.SERIAL_NUMBER
          );
          break;
        case DroneState.RETURNING:
          await setDroneState(DbDroneState.IDLE, drone.SERIAL_NUMBER);
          await setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 25,
            drone.SERIAL_NUMBER
          );
          break;
      }
    });
    Promise.all(auditLogs);
  },
  { connection }
);

new Worker(
  JobQueue.AUDIT_LOG,
  async () => {
    /**
     * - Log state change on a drone
     * - Log medication load onto a drone
     * - Log battery level on a drone
     */
    const drones = await getAllDrones();

    drones.map(async (drone: Drone) => {
      await log(
        `${drone.SERIAL_NUMBER} battery at ${drone.BATTERY_PERCENTAGE}%`
      );

      await log(`${drone.SERIAL_NUMBER} in ${drone.STATE} state`);
      const droneCargo = await queryDroneCargo(drone.SERIAL_NUMBER);

      if (droneCargo.length) {
        await log(`${drone.SERIAL_NUMBER} carrying ${arrToString(droneCargo)}`);
      }
    });
  },
  { connection }
);

simulationQueue.add(
  JobQueue.SIMULATION,
  { name: JobQueue.SIMULATION },
  { repeat: { every: SIMULATION_INTERVAL } }
);

auditQueue.add(
  JobQueue.AUDIT_LOG,
  { name: JobQueue.AUDIT_LOG },
  { repeat: { every: AUDIT_LOG_INTERVAL } }
);

export { auditQueue, simulationQueue };
