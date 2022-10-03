import { Router } from "express";
import {
  registerDrone,
  loadDrone,
  getDroneCargo,
  getAvailableDrones,
  getDroneBatteryPercent,
  dispatchDrone,
} from "../../controllers/DispatchController";

const router = Router();

router.post("/register", registerDrone);
router.post("/load", loadDrone);
router.get("/cargo", getDroneCargo);
router.get("/available", getAvailableDrones);
router.get("/battery", getDroneBatteryPercent);
router.post("/dispatch", dispatchDrone);


export default router;
