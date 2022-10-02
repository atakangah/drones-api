import { Request, Response } from "express";
import {
  IDroneCargoMockRequest,
  IDroneLoadMockRequest,
  IDroneRegisterMockRequest,
  IMockResponse,
} from "express-types";
import { insert, execStmt, query } from "../util/DbRunner";
export const registerDrone = async (
  req: Request | IDroneRegisterMockRequest,
  res: Response | IMockResponse
): Promise<any> => {
  const { serialNumber, batteryPercentage, weightLimit, model } = req.body;

  await insert(`
        INSERT INTO DRONE (SERIAL_NUMBER, BATTERY_PERCENTAGE, WEIGHT_LIMIT, MODEL, STATE) 
        VALUES ("${serialNumber}", "${batteryPercentage}", "${weightLimit}", ${model}, "1")
    `);

  res.status(200).json({ message: `${serialNumber} register success` });
};

export const loadDrone = async (
  req: Request | IDroneLoadMockRequest,
  res: Response | IMockResponse
): Promise<any> => {
  const { droneSerialNumber, medicationsNames } = req.body;

  const medicationsTooHeavy = await medicationsHeavierThanDrone(
    droneSerialNumber,
    medicationsNames
  );

  if (medicationsTooHeavy) {
    return res.status(400).json({
      message: `medications exceed carrying weight of ${droneSerialNumber}`,
    });
  }

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

  res.status(200).json({ message: `${droneSerialNumber} load success` });
};


const medicationsHeavierThanDrone = async (
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

