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
        ( "Penycillin", 250, "PEN_45"), \
        ( "Chropromazim", 30, "MAZIM_30"), \
        ( "Aspirin", 10, "ASP_10"), \
        ( "Amoxicillin", 90, "AMOXI_9"), \
        ( "Gabapentin", 80, "GABA_80"), \
        ( "Ibuprofen", 100, "BUPROFEN_100"), \
        ( "Clindamycin", 30, "CLI_30"), \
        ( "Azithromycin", 120, "AZITHRO_120"), \
        ( "Hydroxychloroquine", 300, "HYDROXYCHLORO_300"), \
        ( "Xanax", 5, "XANAX_5") \
      '
    );
  });
};
