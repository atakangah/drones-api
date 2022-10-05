import { IMedicationSaveRequest } from "express-types";
import { arrToChainOfSQLOR } from "../util/converters";
import { DatabaseService } from "./DatabaseService";

export class MedicationService {

  getAllMedications = async (): Promise<any> => {
    return await DatabaseService.query(`
        SELECT * FROM MEDICATION
    `);
  };

  getMedication = async (names: string[]): Promise<any> => {
    const chainOfOrClauses = arrToChainOfSQLOR(names);
    return await DatabaseService.query(`
        SELECT NAME FROM MEDICATION WHERE ${chainOfOrClauses}
    `);
  };

  insertMedication = async (
    medication: IMedicationSaveRequest
  ): Promise<any> => {
    const { name, weight, code, image } = medication.body;

    const insertResult = await DatabaseService.insert(`
      INSERT INTO MEDICATION (NAME, WEIGHT, CODE, IMAGE)
      VALUES ("${name}", "${weight}", "${code}", "${image}")
    `);
    
    if (insertResult) {
      return {message: `Failed. ${name} already exists`};
    }

    return {message: `${name} add success`};
  };
}
