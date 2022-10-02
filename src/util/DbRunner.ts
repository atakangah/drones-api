import sqlite3 from "sqlite3";
import logger from "./logger";

let db: sqlite3.Database;
export const connect = (): sqlite3.Database => {
  db = new (sqlite3.verbose().Database)("musala.sqlite", (error) => {
    if (error) {
      return logger.error(error);
    }
    logger.info("Db connected");
  });
  return db;
};
export const insert = (sqlQuery: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sqlQuery, (result: sqlite3.RunResult, error: Error) => {
      if (error) {
        return reject();
      }
      return resolve(result);
    });
  });
};

export const execStmt = (sqlQuery: string, values: any[]): Promise<any> => {
    return new Promise((resolve) => {
        const stmt = db.prepare(sqlQuery);
        for (const value of values) {
            stmt.run(value);
        }
        stmt.finalize();
        resolve(true);
    });
};

export const query = (sqlQuery: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    /**
     * According to sqlite3 docs @argument possibleError is the position argument for query result
     * and @argument actualResult is the error possition. But this is not the case as results 
     * and error positions have switched. Therefore paramter names have also been changed to reflect this
     */
    db.all(
      sqlQuery,
      (error: Error, actualResult: any[], possibleError: Error) => {
        if (error || possibleError) {
          return reject();
        }
        return resolve(actualResult);
      }
    );
  });
};

