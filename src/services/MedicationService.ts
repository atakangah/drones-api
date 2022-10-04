import { query } from "../util/dbrunner";

export const getAllMedications = async (): Promise<any> => {
  return await query(`
        SELECT * FROM MEDICATION
    `);
};

export const getMedication = async (name: string): Promise<any> => {
  return await query(`
        SELECT NAME FROM MEDICATION WHERE NAME = "${name}"
    `);
};
