import { Request, Response } from "express";
import { getAllMedications, insertMedication } from "../services/MedicationService";

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
  await insertMedication(req);

  res.status(200).json({message: "medication add success"});
};
