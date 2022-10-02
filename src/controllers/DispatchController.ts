import { Request, Response } from "express";
import { IMockRequest, IMockResponse } from "express-types";
import { insert, query } from "../util/DbRunner";
export const registerDrone = async (
  req: Request | IMockRequest,
  res: Response | IMockResponse
): Promise<any> => {
  const { serialNumber, batteryPercentage, weightLimit, model } = req.body;

  await insert(`
        INSERT INTO DRONE (SERIAL_NUMBER, BATTERY_PERCENTAGE, WEIGHT_LIMIT, MODEL, STATE) 
        VALUES ("${serialNumber}", "${batteryPercentage}", "${weightLimit}", ${model}, "1")
    `);

  res.status(200).json({ message: "New drone added" });
};
