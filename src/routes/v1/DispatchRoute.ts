import { Router } from "express";
import {
  registerDrone,
  loadDrone,
  getDroneCargo,
  getAvailableDrones,
  getDroneBatteryPercent,
} from "../../controllers/DispatchController";

const router = Router();

router.post("/register", registerDrone);
router.post("/load", loadDrone);
router.get("/cargo", getDroneCargo);
router.get("/available", getAvailableDrones);
router.get("/battery", getDroneBatteryPercent);

export default router;
