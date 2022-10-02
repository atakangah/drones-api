/* eslint-disable quotes */
import sqlite3 from "sqlite3";

export const SetupDroneTable = (db: sqlite3.Database): void => {

    db.serialize(() => {
        db.run("DROP TABLE IF EXISTS DRONE");

        db.run(
            "CREATE TABLE IF NOT EXISTS DRONE_MODEL ( \
              ID TEXT PRIMARY KEY NOT NULL, \
              MODEL TEXT NOT NULL \
            )"
          );
          db.run(
            'INSERT OR IGNORE INTO DRONE_MODEL (ID, MODEL) VALUES \
            ("1", "Lightweight"), \
            ("2", "Middleweight"), \
            ("3", "Cruiserweight"), \
            ("4", "Heavyweight") \
          '
          );
        
          db.run(
            "CREATE TABLE IF NOT EXISTS DRONE_STATE ( \
              ID TEXT PRIMARY KEY NOT NULL, \
              STATE TEXT NOT NULL \
            )"
          );
        
          db.run(
            'INSERT OR IGNORE INTO DRONE_STATE (ID, STATE) VALUES \
            ("1", "IDLE"), \
            ("2", "LOADING"), \
            ("3", "LOADED"), \
            ("4", "DELIVERING"), \
            ("5", "DELIVERED"), \
            ("6", "RETURNING") \
            '
          );
        
          db.run(
            "CREATE TABLE IF NOT EXISTS DRONE( \
              SERIAL_NUMBER TEXT CHECK(LENGTH(SERIAL_NUMBER) <= 100) PRIMARY KEY, \
              BATTERY_PERCENTAGE INTEGER NOT NULL DEFAULT '100',\
              WEIGHT_LIMIT INTEGER CHECK (WEIGHT_LIMIT <= 500) NOT NULL, \
              MODEL TEXT NOT NULL, \
              STATE TEXT NOT NULL, \
              FOREIGN KEY (MODEL) REFERENCES DRONE_MODEL (ID) \
              FOREIGN KEY (STATE) REFERENCES DRONE_STATE (ID) \
            )"
          );
        
          db.run(
            'INSERT OR IGNORE INTO DRONE(SERIAL_NUMBER, BATTERY_PERCENTAGE, WEIGHT_LIMIT, MODEL, STATE) \
            VALUES("DRONE1", 90, 500, "1", "2")'
          );
    });
};
