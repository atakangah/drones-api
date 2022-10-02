import { Router } from "express";
import {
  registerDrone,
  loadDrone,
  getDroneCargo,
} from "../../controllers/DispatchController";

const router = Router();

router.post("/register", registerDrone);
router.post("/load", loadDrone);
router.get("/cargo", getDroneCargo);

export default router;
