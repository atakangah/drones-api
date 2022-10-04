import { Router } from "express";
import { RequestValidator } from "../../middleware/RequestValidator";
import {
  registerDrone,
  loadDrone,
  getDroneCargo,
  getAvailableDrones,
  getDroneBatteryPercent,
  dispatchDrone,
  getAuditLogs,
} from "../../controllers/DispatchController";

const router = Router();

router.post("/load", RequestValidator, loadDrone);
router.post("/register", RequestValidator, registerDrone);
router.post("/dispatch", RequestValidator, dispatchDrone);
router.get("/battery", RequestValidator, getDroneBatteryPercent);
router.get("/cargo", RequestValidator, getDroneCargo);
router.get("/available", getAvailableDrones);
router.get("/logs", getAuditLogs);

export default router;
