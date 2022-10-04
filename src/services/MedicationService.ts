import { IMedicationSaveRequest } from "express-types";
import { arrToChainOfSQLOR } from "../util/converters";
import { insert, query } from "../util/dbrunner";

export const getAllMedications = async (): Promise<any> => {
  return await query(`
        SELECT * FROM MEDICATION
    `);
};

export const getMedication = async (names: string[]): Promise<any> => {
  const chainOfOrClauses = arrToChainOfSQLOR(names);
  return await query(`
        SELECT NAME FROM MEDICATION WHERE ${chainOfOrClauses}
    `);
};

export const insertMedication = async (
  medication: IMedicationSaveRequest
): Promise<any> => {
  const { name, weight, code, image } = medication.body;
  console.log("meds", name, weight, code, image);
  await insert(`
    INSERT INTO MEDICATION (NAME, WEIGHT, CODE, IMAGE)
    VALUES ("${name}", "${weight}", "${code}", "${image}")
  `);
};
