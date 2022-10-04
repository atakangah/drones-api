import { query } from "../util/dbrunner";

export const getAllMedications = async (): Promise<any> => {
  return await query(`
        SELECT * FROM MEDICATION
    `);
};
