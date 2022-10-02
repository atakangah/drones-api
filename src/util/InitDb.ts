/* eslint-disable quotes */
import { connect } from "./DbRunner";
import { InitCargoTable } from "./InitCargoTable";
import { InitDroneTable } from "./InitDroneTable";
import { InitMedicationTable } from "./InitMedicationTable";

const db = connect();
db.serialize(() => {
    db.run("PRAGMA foreign_keys = 1");
    InitMedicationTable(db);
    InitDroneTable(db);
    InitCargoTable(db);
});

