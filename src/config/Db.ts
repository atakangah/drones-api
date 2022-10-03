/* eslint-disable quotes */
import { connect } from "../util/dbrunner";
import { InitCargoTable } from "./CargoTable";
import { InitDroneTable } from "./DroneTable";
import { InitLogsTable } from "./LogsTable";
import { InitMedicationTable } from "./MedicationTable";

const db = connect();
db.serialize(() => {
  db.run("PRAGMA foreign_keys = 1");
  InitMedicationTable(db);
  InitDroneTable(db);
  InitCargoTable(db);
  InitLogsTable(db);
});
