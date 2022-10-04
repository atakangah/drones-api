import { Queue, Worker, QueueScheduler } from "bullmq";
import IORedis from "ioredis";
import { Drone } from "../models/Drone";
import { DbDroneState, DroneState, JobQueue } from "../types/db-constants";
import { arrToString } from "../util/converters";
import { REDIS_SERVER } from "../util/secrets";
import { DispatchService } from "./DispatchService";

const dispatchService: DispatchService = new DispatchService();

const SIMULATION_INTERVAL = 1000 * 60 * 5;
const AUDIT_LOG_INTERVAL = 1000 * 60 * 7;

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
    const drones = await dispatchService.getAllDrones();

    const simulationStates = drones.map(async (drone: Drone) => {
      switch (drone.STATE) {
        case DroneState.IDLE:
          if (drone.BATTERY_PERCENTAGE != 100) {
            await dispatchService.setDroneBatteryPercent(
              100,
              drone.SERIAL_NUMBER
            );
          }
          break;
        case DroneState.LOADED:
          await dispatchService.setDroneState(
            DbDroneState.DELIVERING,
            drone.SERIAL_NUMBER
          );
          await dispatchService.setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 15,
            drone.SERIAL_NUMBER
          );
          break;
        case DroneState.DELIVERING:
          await dispatchService.setDroneState(
            DbDroneState.DELIVERED,
            drone.SERIAL_NUMBER
          );
          await dispatchService.setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 25,
            drone.SERIAL_NUMBER
          );
          break;
        case DroneState.DELIVERED:
          await dispatchService.offloadDroneCargo(drone.SERIAL_NUMBER);
          await dispatchService.setDroneState(
            DbDroneState.RETURNING,
            drone.SERIAL_NUMBER
          );
          await dispatchService.setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 15,
            drone.SERIAL_NUMBER
          );
          break;
        case DroneState.RETURNING:
          await dispatchService.setDroneState(
            DbDroneState.IDLE,
            drone.SERIAL_NUMBER
          );
          await dispatchService.setDroneBatteryPercent(
            drone.BATTERY_PERCENTAGE - 25,
            drone.SERIAL_NUMBER
          );
          break;
      }
    });
    Promise.all(simulationStates);
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
    const drones = await dispatchService.getAllDrones();

    const auditLogs = drones.map(async (drone: Drone) => {
      await dispatchService.log(
        `${drone.SERIAL_NUMBER} battery at ${drone.BATTERY_PERCENTAGE}%`
      );

      await dispatchService.log(
        `${drone.SERIAL_NUMBER} in ${drone.STATE} state`
      );
      const droneCargo = await dispatchService.queryDroneCargo(
        drone.SERIAL_NUMBER
      );

      if (droneCargo.length) {
        await dispatchService.log(
          `${drone.SERIAL_NUMBER} carrying ${arrToString(droneCargo)}`
        );
      }
    });
    Promise.all(auditLogs);
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
