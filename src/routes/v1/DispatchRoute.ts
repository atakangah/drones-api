import { Router } from "express";
import { registerDrone } from "../../controllers/DispatchController";

const router = Router();

router.post("/register", registerDrone);

export default router;

