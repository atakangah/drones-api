import { IDroneRegisterRequest } from "express-types";
import { DatabaseService } from "./DatabaseService";

export class DispatchService {
  insertDrone = async (drone: IDroneRegisterRequest): Promise<any> => {
    const { serialNumber, batteryPercentage, weightLimit, model } = drone.body;

    const insertResult = await DatabaseService.insert(`
      INSERT INTO DRONE (SERIAL_NUMBER, BATTERY_PERCENTAGE, WEIGHT_LIMIT, MODEL, STATE) 
      VALUES ("${serialNumber}", "${batteryPercentage}", "${weightLimit}", ${model}, "1")
    `);

    if (insertResult) {
      return { message: `Failed. ${serialNumber} already exists` };
    }

    return { message: `${serialNumber} add success` };
  };

  medicationsHeavierThanDrone = async (
    droneSerialNumber: string,
    medicationsNames: string[]
  ): Promise<boolean> => {
    const medicationWeights: any[] = medicationsNames.map(
      async (medication) =>
        await DatabaseService.query(
          `SELECT WEIGHT FROM MEDICATION WHERE NAME = "${medication}"`
        )
    );
    const resolvedMedicationWeights = await Promise.all(medicationWeights);
    const currentDroneCargo = await this.queryDroneCargoWeight(
      droneSerialNumber
    );

    const totalMedicationsWeight = this.calculateTotalWeight(
      currentDroneCargo,
      resolvedMedicationWeights
    );

    const droneWeightLimit = await DatabaseService.query(
      `SELECT WEIGHT_LIMIT FROM DRONE WHERE SERIAL_NUMBER = "${droneSerialNumber}"`
    );
    return totalMedicationsWeight > droneWeightLimit[0].WEIGHT_LIMIT;
  };

  calculateTotalWeight = (
    currentDroneCargo: any[],
    medicationWeights: any[]
  ): number => {
    return [...currentDroneCargo, ...medicationWeights].reduce((prev, curr) => {
      if (curr["WEIGHT"]) {
        return prev + curr.WEIGHT;
      }
      return prev + curr[0].WEIGHT;
    }, 0);
  };

  droneBatteryLowerThan25 = async (
    droneSerialNumber: string
  ): Promise<boolean> => {
    const batteryPercentage = await this.queryBatteryPercentage(
      droneSerialNumber
    );
    return batteryPercentage < 25;
  };

  queryBatteryPercentage = async (droneSerialNumber: string): Promise<any> => {
    const droneBatteryPercentage = await DatabaseService.query(`
        SELECT DRONE.BATTERY_PERCENTAGE FROM DRONE WHERE SERIAL_NUMBER = "${droneSerialNumber}"
      `);
    return droneBatteryPercentage[0]["BATTERY_PERCENTAGE"];
  };

  execDroneLoad = async (
    droneSerialNumber: string,
    medicationsNames: string[]
  ): Promise<any> => {
    const stmtValues = medicationsNames.map((name: string) => [
      droneSerialNumber,
      name,
    ]);

    await DatabaseService.execStmt(
      `
          INSERT INTO CARGO (SERIAL_ID, MEDICATION_ID) 
          VALUES (?, ?)
        `,
      stmtValues
    );
  };

  queryDroneCargoWeight = async (droneSerialNumber: string): Promise<any> => {
    return await DatabaseService.query(`
      SELECT MEDICATION.WEIGHT FROM CARGO INNER JOIN MEDICATION \
      ON CARGO.MEDICATION_ID = MEDICATION.NAME \
      WHERE CARGO.SERIAL_ID = "${droneSerialNumber}"
    `);
  };

  queryDroneCargo = async (droneSerialNumber: string): Promise<any> => {
    const droneCargo = await DatabaseService.query(`
      SELECT MEDICATION.NAME FROM CARGO INNER JOIN MEDICATION \
      ON CARGO.MEDICATION_ID = MEDICATION.NAME \
      WHERE CARGO.SERIAL_ID = "${droneSerialNumber}"
    `);

    return droneCargo.map((cargo: any) => cargo.NAME);
  };

  queryAvailableDrones = async (): Promise<any> => {
    const availableDrones = await DatabaseService.query(`
      SELECT DRONE.SERIAL_NUMBER, DRONE.BATTERY_PERCENTAGE, 
      DRONE.WEIGHT_LIMIT, DRONE_STATE.STATE, DRONE_MODEL.MODEL 
      FROM DRONE 
      INNER JOIN DRONE_STATE 
      ON DRONE_STATE.ID = DRONE.STATE
      INNER JOIN DRONE_MODEL 
      ON DRONE_MODEL.ID = DRONE.MODEL
      WHERE DRONE_STATE.STATE = "IDLE" 
      OR DRONE_STATE.STATE = "LOADING"
    `);
    return availableDrones;
  };

  getDrone = async (droneSerialNumber: string): Promise<any> => {
    return await DatabaseService.query(`
      SELECT DRONE.SERIAL_NUMBER, DRONE.BATTERY_PERCENTAGE, 
      DRONE.WEIGHT_LIMIT, DRONE_STATE.STATE, DRONE_MODEL.MODEL 
      FROM DRONE 
      INNER JOIN DRONE_STATE 
      ON DRONE_STATE.ID = DRONE.STATE
      INNER JOIN DRONE_MODEL 
      ON DRONE_MODEL.ID = DRONE.MODEL
      WHERE DRONE.SERIAL_NUMBER = "${droneSerialNumber}"
    `);
  };

  getAllDrones = async (): Promise<any> => {
    return await DatabaseService.query(`
      SELECT DRONE.SERIAL_NUMBER, DRONE.BATTERY_PERCENTAGE, 
      DRONE.WEIGHT_LIMIT, DRONE_STATE.STATE, DRONE_MODEL.MODEL 
      FROM DRONE 
      INNER JOIN DRONE_STATE 
      ON DRONE_STATE.ID = DRONE.STATE
      INNER JOIN DRONE_MODEL 
      ON DRONE_MODEL.ID = DRONE.MODEL
    `);
  };

  setDroneState = async (
    state: string,
    droneSerialNumber: string
  ): Promise<any> => {
    await DatabaseService.execStmt(
      `
      UPDATE DRONE SET STATE = ? WHERE SERIAL_NUMBER = ?
    `,
      [[state, droneSerialNumber]]
    );
  };

  setDroneBatteryPercent = async (
    batteryPercent: number,
    droneSerialNumber: string
  ): Promise<any> => {
    await DatabaseService.execStmt(
      `
      UPDATE DRONE SET BATTERY_PERCENTAGE = ? WHERE SERIAL_NUMBER = ?
    `,
      [[batteryPercent, droneSerialNumber]]
    );
  };

  offloadDroneCargo = async (droneSerialNumber: string): Promise<any> => {
    await DatabaseService.execStmt(
      `
        DELETE FROM CARGO WHERE SERIAL_ID = ?
      `,
      [droneSerialNumber]
    );
  };

  log = async (logMessage: string): Promise<any> => {
    await DatabaseService.insert(`
      INSERT INTO LOGS(LOG) VALUES("${logMessage}")
    `);
  };

  getLogs = async (): Promise<any> => {
    return DatabaseService.query(`
      SELECT * FROM LOGS
    `);
  };
}
