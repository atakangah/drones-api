/* eslint-disable quotes */
import sqlite3 from "sqlite3";

export const InitCargoTable = (db: sqlite3.Database): void => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS CARGO");

    db.run(
      "CREATE TABLE IF NOT EXISTS CARGO ( \
            ID INTEGER PRIMARY KEY, \
            SERIAL_ID TEXT NOT NULL, \
            MEDICATION_ID TEXT NOT NULL, \
            FOREIGN KEY (MEDICATION_ID) REFERENCES MEDICATION (NAME) ON DELETE CASCADE \
            FOREIGN KEY (SERIAL_ID) REFERENCES DRONE (SERIAL_NUMBER) ON DELETE CASCADE\
        )"
    );
  });
};

