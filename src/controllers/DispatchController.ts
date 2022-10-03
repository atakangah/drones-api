import { Request, Response } from "express";
import {
  IDroneCargoRequest,
  IDroneLoadRequest,
  IDroneRegisterRequest,
  IResponse,
} from "express-types";
import {
  droneBatteryLowerThan25,
  execDroneLoad,
  insertDrone,
  medicationsHeavierThanDrone,
  queryAvailableDrones,
  queryBatteryPercentage,
  queryDroneCargo,
} from "../services/DispatchService";

export const registerDrone = async (
  req: Request | IDroneRegisterRequest,
  res: Response | IResponse
): Promise<any> => {
  const { serialNumber } = req.body;

  await insertDrone(req);

  res.status(200).json({ message: `${serialNumber} register success` });
};

export const loadDrone = async (
  req: Request | IDroneLoadRequest,
  res: Response | IResponse
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

  const droneBatteryLow = droneBatteryLowerThan25(droneSerialNumber as string);
  if (droneBatteryLow) {
    return res.status(400).json({
      message: `${droneSerialNumber} battery below 25%`,
    });
  }

  await execDroneLoad(droneSerialNumber as string, medicationsNames);

  res.status(200).json({ message: `${droneSerialNumber} load success` });
};

export const getDroneBatteryPercent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { droneSerialNumber } = req.query;

  const droneBatteryPercent = await queryBatteryPercentage(
    droneSerialNumber as string
  );

  res.status(200).json({
    message: "drone battery retrieve success",
    payload: droneBatteryPercent["BATTERY_PERCENTAGE"],
  });
};

export const getDroneCargo = async (
  req: Request | IDroneCargoRequest,
  res: Response | IResponse
): Promise<any> => {
  const { droneSerialNumber } = req.query;

  const droneCargo = await queryDroneCargo(droneSerialNumber);

  res.status(200).json({
    message: "drone cargo retrieve success",
    payload: droneCargo,
  });
};

export const getAvailableDrones = async (
  req: Request,
  res: Response
): Promise<any> => {
  const availableDrones = await queryAvailableDrones();

  res.status(200).json({
    message: "available drones retrieve success",
    payload: availableDrones,
  });
};
