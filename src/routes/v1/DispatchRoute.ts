import { Router } from "express";
import { RequestValidator } from "../../middleware/RequestValidator";
import { DispatchController } from "../../controllers/DispatchController";
import { DispatchService } from "../../services/DispatchService";

const dispatchService = new DispatchService();
const dispatchController = new DispatchController(dispatchService);
const router = Router();

router.post("/load", RequestValidator, dispatchController.loadDrone);
router.post("/register", RequestValidator, dispatchController.registerDrone);
router.post("/dispatch", RequestValidator, dispatchController.dispatchDrone);
router.get("/battery", RequestValidator, dispatchController.getDroneBatteryPercent);
router.get("/cargo", RequestValidator, dispatchController.getDroneCargo);
router.get("/available", dispatchController.getAvailableDrones);
router.get("/logs", dispatchController.getAuditLogs);

export default router;
