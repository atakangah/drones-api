import sqlite3 from "sqlite3";
import { InitCargoTable } from "../config/CargoTable";
import { InitDroneTable } from "../config/DroneTable";
import { InitLogsTable } from "../config/LogsTable";
import { InitMedicationTable } from "../config/MedicationTable";
import logger from "../util/logger";

export class DatabaseService {
  static db: sqlite3.Database;

  static initialize = (): void => {
    DatabaseService.db.serialize(() => {
      DatabaseService.db.run("PRAGMA foreign_keys = 1");
      InitMedicationTable(DatabaseService.db);
      InitDroneTable(DatabaseService.db);
      InitCargoTable(DatabaseService.db);
      InitLogsTable(DatabaseService.db);
    });
  };

  static getDatabase = (): any => {
    return DatabaseService;
  };

  static connect = (): void => {
    DatabaseService.db = new (sqlite3.verbose().Database)("musala.sqlite", (error) => {
      if (error) {
        return logger.error(error);
      }
      logger.info("Db connected");
    });
  };

  static insert = (sqlQuery: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      DatabaseService.db.run(sqlQuery, (result: sqlite3.RunResult, error: Error) => {
        if (error) {
          return reject();
        }
        return resolve(result);
      });
    });
  };

  static execStmt = (sqlQuery: string, values: any[]): Promise<any> => {
    return new Promise((resolve) => {
      const stmt = DatabaseService.db.prepare(sqlQuery);
      for (const value of values) {
        stmt.run(value);
      }
      stmt.finalize();
      resolve(true);
    });
  };

  static query = (sqlQuery: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      /**
       * According to sqlite3 docs @argument possibleError is the position argument for query result
       * and @argument actualResult is the error possition. But this is not the case as results
       * and error positions have switched. Therefore paramter names have also been changed to reflect this
       */
      DatabaseService.db.all(
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
}
