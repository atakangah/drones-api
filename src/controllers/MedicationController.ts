import { Request, Response } from "express";
import { medicationNameValid, medicationCodeValid } from "..//util/validators";
import {
  getAllMedications,
  insertMedication,
} from "../services/MedicationService";

export const getMedications = async (
  req: Request,
  res: Response
): Promise<any> => {
  const allMedications = await getAllMedications();

  res
    .status(200)
    .json({ message: "Medications retrieve success", payload: allMedications });
};

export const addMedication = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, code, weight } = req.body;

  if (!name || !code || !weight) {
    return res
      .status(400)
      .json({ message: "All required parameters not provided" });
  }

  if (!medicationNameValid(name) || !medicationCodeValid(code)) {
    return res
      .status(400)
      .json({ message: "Invalid medication code or medication name supplied" });
  }

  await insertMedication(req);
  res.status(200).json({ message: "medication add success" });
};
