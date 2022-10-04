import { IDroneRegisterRequest } from "express-types";
import { execStmt, query, insert } from "../util/dbrunner";

export const insertDrone = async (
  drone: IDroneRegisterRequest
): Promise<any> => {
  const { serialNumber, batteryPercentage, weightLimit, model } =
    drone.body;

  await insert(`
    INSERT INTO DRONE (SERIAL_NUMBER, BATTERY_PERCENTAGE, WEIGHT_LIMIT, MODEL, STATE) 
    VALUES ("${serialNumber}", "${batteryPercentage}", "${weightLimit}", ${model}, "1")
`);
};

export const medicationsHeavierThanDrone = async (
  droneSerialNumber: string,
  medicationsNames: string[]
): Promise<boolean> => {
  const medicationWeights: any[] = medicationsNames.map(
    async (medication) =>
      await query(`SELECT WEIGHT FROM MEDICATION WHERE NAME = "${medication}"`)
  );
  const resolvedMedicationWeights = await Promise.all(medicationWeights);
  const currentDroneCargo = await queryDroneCargoWeight(droneSerialNumber);

  const totalMedicationsWeight = calculateTotalWeight(
    currentDroneCargo,
    resolvedMedicationWeights
  );

  const droneWeightLimit = await query(
    `SELECT WEIGHT_LIMIT FROM DRONE WHERE SERIAL_NUMBER = "${droneSerialNumber}"`
  );
  return totalMedicationsWeight > droneWeightLimit[0].WEIGHT_LIMIT;
};

const calculateTotalWeight = (
  currentDroneCargo: any[],
  medicationWeights: any[]
) => {
  return [...currentDroneCargo, ...medicationWeights].reduce((prev, curr) => {
    if (curr["WEIGHT"]) {
      return prev + curr.WEIGHT;
    }
    return prev + curr[0].WEIGHT;
  }, 0);
};

export const droneBatteryLowerThan25 = async (
  droneSerialNumber: string
): Promise<boolean> => {
  const batteryPercentage = await queryBatteryPercentage(droneSerialNumber);
  return batteryPercentage < 25;
};

export const queryBatteryPercentage = async (
  droneSerialNumber: string
): Promise<any> => {
  const droneBatteryPercentage = await query(`
      SELECT DRONE.BATTERY_PERCENTAGE FROM DRONE WHERE SERIAL_NUMBER = "${droneSerialNumber}"
    `);
  return droneBatteryPercentage[0]["BATTERY_PERCENTAGE"];
};

export const execDroneLoad = async (
  droneSerialNumber: string,
  medicationsNames: string[]
): Promise<any> => {
  const stmtValues = medicationsNames.map((name: string) => [
    droneSerialNumber,
    name,
  ]);

  await execStmt(
    `
        INSERT INTO CARGO (SERIAL_ID, MEDICATION_ID) 
        VALUES (?, ?)
      `,
    stmtValues
  );
};

export const queryDroneCargoWeight = async (
  droneSerialNumber: string
): Promise<any> => {
  return await query(`
    SELECT MEDICATION.WEIGHT FROM CARGO INNER JOIN MEDICATION \
    ON CARGO.MEDICATION_ID = MEDICATION.NAME \
    WHERE CARGO.SERIAL_ID = "${droneSerialNumber}"
  `);
};

export const queryDroneCargo = async (
  droneSerialNumber: string
): Promise<any> => {
  const droneCargo = await query(`
    SELECT MEDICATION.NAME FROM CARGO INNER JOIN MEDICATION \
    ON CARGO.MEDICATION_ID = MEDICATION.NAME \
    WHERE CARGO.SERIAL_ID = "${droneSerialNumber}"
  `);

  return droneCargo.map((cargo: any) => cargo.NAME);
};

export const queryAvailableDrones = async (): Promise<any> => {
  const availableDrones = await query(`
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

export const getDrone = async (droneSerialNumber: string): Promise<any> => {
  return await query(`
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

export const getAllDrones = async (): Promise<any> => {
  return await query(`
    SELECT DRONE.SERIAL_NUMBER, DRONE.BATTERY_PERCENTAGE, 
    DRONE.WEIGHT_LIMIT, DRONE_STATE.STATE, DRONE_MODEL.MODEL 
    FROM DRONE 
    INNER JOIN DRONE_STATE 
    ON DRONE_STATE.ID = DRONE.STATE
    INNER JOIN DRONE_MODEL 
    ON DRONE_MODEL.ID = DRONE.MODEL
  `);
};

export const setDroneState = async (
  state: string,
  droneSerialNumber: string
): Promise<any> => {
  await execStmt(
    `
    UPDATE DRONE SET STATE = ? WHERE SERIAL_NUMBER = ?
  `,
    [[state, droneSerialNumber]]
  );
};

export const setDroneBatteryPercent = async (
  batteryPercent: number,
  droneSerialNumber: string
): Promise<any> => {
  await execStmt(
    `
    UPDATE DRONE SET BATTERY_PERCENTAGE = ? WHERE SERIAL_NUMBER = ?
  `,
    [[batteryPercent, droneSerialNumber]]
  );
};

export const offloadDroneCargo = async (
  droneSerialNumber: string
): Promise<any> => {
  await execStmt(
    `
      DELETE FROM CARGO WHERE SERIAL_ID = ?
    `,
    [droneSerialNumber]
  );
};

export const log = async (logMessage: string): Promise<any> => {
  await insert(`
    INSERT INTO LOGS(LOG) VALUES("${logMessage}")
  `);
};

export const getLogs = async (): Promise<any> => {
  return query(`
    SELECT * FROM LOGS
  `);
};
