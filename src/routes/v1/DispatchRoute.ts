import { Router } from "express";
import { registerDrone, loadDrone } from "../../controllers/DispatchController";

const router = Router();

router.post("/register", registerDrone);
router.post("/load", loadDrone);

export default router;
