import { Request, Response } from "express";
import {
  DbDroneState,
  DroneModelMap,
  DroneState,
  DroneStateMap,
} from "../types/db-constants";
import { DispatchService } from "../services/DispatchService";

export class DispatchController {
  dispatchService: DispatchService;

  constructor(dispatcherService: DispatchService | any) {
    this.dispatchService = dispatcherService;
  }

  async registerDrone(
    req: Request | any,
    res: Response | any
  ): Promise<any> {
    const { serialNumber, model, state, weightLimit, batteryPercentage } =
      req.body;

    if (
      !serialNumber ||
      !model ||
      !state ||
      !weightLimit ||
      !batteryPercentage
    ) {
      return res
        .status(400)
        .json({ message: "All required request parameters not provided" });
    }

    req.body.model = DroneModelMap[model];
    req.body.state = DroneStateMap[state];

    await this.dispatchService.insertDrone(req);
    res.status(200).json({ message: `${serialNumber} register success` });
  }

  loadDrone = async (
    req: Request | any,
    res: Response | any
  ): Promise<any> => {
    const { droneSerialNumber, medicationsNames } = req.body;

    if (!droneSerialNumber || !medicationsNames) {
      return res.status(400).json({
        message: "Drone serial number or medications names not provided",
      });
    }

    const medicationsTooHeavy =
      await this.dispatchService.medicationsHeavierThanDrone(
        droneSerialNumber,
        medicationsNames
      );
    if (medicationsTooHeavy) {
      return res.status(400).json({
        message: `medications exceed carrying weight of ${droneSerialNumber}`,
      });
    }

    const droneBatteryLow = await this.dispatchService.droneBatteryLowerThan25(
      droneSerialNumber as string
    );
    if (droneBatteryLow) {
      return res.status(400).json({
        message: `${droneSerialNumber} battery below 25%`,
      });
    }

    const drone = await this.dispatchService.getDrone(droneSerialNumber);
    if (
      drone[0].STATE !== DroneState.IDLE &&
      drone[0].STATE !== DroneState.LOADING
    ) {
      return res.status(400).json({
        message: `Loading ${droneSerialNumber} failed. Drone not available`,
      });
    }

    await this.dispatchService.setDroneState(
      DbDroneState.LOADING,
      droneSerialNumber
    );
    await this.dispatchService.execDroneLoad(
      droneSerialNumber as string,
      medicationsNames
    );

    res.status(200).json({ message: `${droneSerialNumber} load success` });
  };

  getDroneBatteryPercent = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    const { droneSerialNumber } = req.query;

    if (!droneSerialNumber) {
      return res
        .status(400)
        .json({ message: "Drone serial number not provided" });
    }

    const droneBatteryPercent =
      await this.dispatchService.queryBatteryPercentage(
        droneSerialNumber as string
      );

    res.status(200).json({
      message: "drone battery retrieve success",
      payload: droneBatteryPercent,
    });
  };

  getDroneCargo = async (
    req: Request | any,
    res: Response | any
  ): Promise<any> => {
    const { droneSerialNumber } = req.query;

    if (!droneSerialNumber) {
      return res
        .status(400)
        .json({ message: "Drone serial number not provided" });
    }

    const droneCargo = await this.dispatchService.queryDroneCargo(
      droneSerialNumber
    );

    res.status(200).json({
      message: "drone cargo retrieve success",
      payload: droneCargo,
    });
  };

  getAvailableDrones = async (req: Request, res: Response): Promise<any> => {
    const availableDrones = await this.dispatchService.queryAvailableDrones();

    res.status(200).json({
      message: "Available drones retrieve success",
      payload: availableDrones,
    });
  };

  dispatchDrone = async (req: Request, res: Response): Promise<any> => {
    const { droneSerialNumber } = req.body;

    if (!droneSerialNumber) {
      return res
        .status(400)
        .json({ message: "Drone serial number not provided" });
    }

    const drone = await this.dispatchService.getDrone(droneSerialNumber);
    if (drone[0].STATE !== DroneState.LOADING) {
      return res.status(400).json({
        message: `Dispatch ${droneSerialNumber} failed. Drone not loaded`,
      });
    }

    await this.dispatchService.setDroneState(
      DbDroneState.LOADED,
      droneSerialNumber
    );

    res.status(200).json({
      message: `${droneSerialNumber} dispatch success`,
    });
  };

  getAuditLogs = async (req: Request, res: Response): Promise<any> => {
    const auditLogs = await this.dispatchService.getLogs();

    return res
      .status(200)
      .json({ message: "Audit logs retrieve success", payload: auditLogs });
  };
}
