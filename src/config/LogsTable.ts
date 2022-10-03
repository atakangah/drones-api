/* eslint-disable quotes */
import sqlite3 from "sqlite3";

export const InitLogsTable = (db: sqlite3.Database): void => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS LOGS ");

    db.run(
      "CREATE TABLE IF NOT EXISTS LOGS ( \
            ID INTEGER PRIMARY KEY, \
            LOG TEXT NOT NULL, \
            LOG_TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP \
        )"
    );
  });
};
