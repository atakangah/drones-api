/* eslint-disable quotes */
import { connect } from "./DbRunner";
import { SetupDroneTable } from "./InitDroneTable";
import { SetupMedicationTable } from "./InitMedicationTable";

const db = connect();
SetupDroneTable(db);
SetupMedicationTable(db);
