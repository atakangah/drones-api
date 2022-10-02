import { Router } from "express";
import {
  registerDrone,
  loadDrone,
  getDroneCargo,
  getAvailableDrones
} from "../../controllers/DispatchController";

const router = Router();

router.post("/register", registerDrone);
router.post("/load", loadDrone);
router.get("/cargo", getDroneCargo);
router.get("/available", getAvailableDrones);

export default router;
