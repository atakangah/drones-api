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
