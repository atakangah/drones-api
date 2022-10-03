import { IDroneRegisterRequest } from "express-types";
import { execStmt, query, insert } from "../util/DbRunner";

export const insertDrone = async (
  droneParams: IDroneRegisterRequest
): Promise<any> => {
  const { serialNumber, batteryPercentage, weightLimit, model } =
    droneParams.body;

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

  const droneWeightLimit = await query(
    `SELECT WEIGHT_LIMIT FROM DRONE WHERE SERIAL_NUMBER = "${droneSerialNumber}"`
  );

  const totalMedicationsWeight = resolvedMedicationWeights.reduce(
    (prev, curr) => prev + curr[0].WEIGHT,
    0
  );

  return totalMedicationsWeight > droneWeightLimit[0].WEIGHT_LIMIT;
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
    const droneBatteryPercent = await query(`
      SELECT DRONE.BATTERY_PERCENTAGE FROM DRONE WHERE SERIAL_NUMBER = "${droneSerialNumber}"
    `);
    return droneBatteryPercent[0];
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
