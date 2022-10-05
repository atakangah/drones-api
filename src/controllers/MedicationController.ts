import { Request, Response } from "express";
import { medicationNameValid, medicationCodeValid } from "..//util/validators";
import { MedicationService } from "../services/MedicationService";

export class MedicationController {
  medicationService: MedicationService;

  constructor(medicationService: MedicationService | any) {
    this.medicationService = medicationService;
  }

  getMedications = async (
    req: Request | any,
    res: Response | any
  ): Promise<any> => {
    const allMedications = await this.medicationService.getAllMedications();

    res.status(200).json({
      message: "Medications retrieve success",
      payload: allMedications,
    });
  };

  addMedication = async (
    req: Request | any,
    res: Response | any
  ): Promise<any> => {
    const { name, code, weight } = req.body;

    if (!name || !code || !weight) {
      return res
        .status(400)
        .json({ message: "All required parameters not provided" });
    }

    if (!medicationNameValid(name) || !medicationCodeValid(code)) {
      return res.status(400).json({
        message: "Invalid medication code or medication name supplied",
      });
    }

    const medicationAddResult = await this.medicationService.insertMedication(req);
    res.status(200).json(medicationAddResult);
  };
}
