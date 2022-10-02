/* eslint-disable quotes */
import sqlite3 from "sqlite3";

export const InitMedicationTable = (db: sqlite3.Database): void => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS MEDICATION ");

    db.run(
      "CREATE TABLE IF NOT EXISTS MEDICATION ( \
            NAME TEXT PRIMARY KEY NOT NULL, \
            WEIGHT INTEGER NOT NULL, \
            CODE TEXT NOT NULL, \
            IMAGE BLOB \
        )"
    );

    db.run(
      'INSERT OR IGNORE INTO MEDICATION (NAME, WEIGHT, CODE) VALUES \
        ( "Penycillin", 501, "PEN_45"), \
        ( "Chropromazim", 30, "MAZIM_30") \
      '
    );
  });
};
