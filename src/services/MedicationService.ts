import { arrToChainOfSQLOR } from "../util/converters";
import { query } from "../util/dbrunner";

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
