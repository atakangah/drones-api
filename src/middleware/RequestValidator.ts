import { NextFunction, Request, Response } from "express";
import { getMedication } from "../services/MedicationService";
import { getDrone } from "../services/DispatchService";
import { RequestParam } from "../types/request-params";

export const RequestValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const requestBody = Object.keys(req.body);
  const requestParams = Object.keys(req.query);

  const queryPromises = [...requestBody, ...requestParams].map(
    async (key: string) => {
      switch (key) {
        case RequestParam.DRONE_SERIAL_NUMBER:
          return getDrone(
            req.body[RequestParam.DRONE_SERIAL_NUMBER] ||
              req.query[RequestParam.DRONE_SERIAL_NUMBER]
          );
        case RequestParam.MEDICATIONS_NAMES:
          return getMedication(
            req.body[RequestParam.MEDICATIONS_NAMES] ||
              req.query[RequestParam.MEDICATIONS_NAMES]
          );
        default:
          return [true];
      }
    }
  );

  const queryResults = await Promise.all(queryPromises);
  const queryInvalid = queryResults.some((result) => !result || !result.length);

  if (queryInvalid) {
    return sendInvalidRequestParams(res);
  }

  next();
};

const sendInvalidRequestParams = async (res: Response): Promise<any> => {
  res
    .status(400)
    .json({ message: "Invalid or unexpected request params or values" });
};
