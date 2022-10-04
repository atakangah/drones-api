import { Router } from "express";
import DroneRoute from "./DispatchRoute";
import MedicationRoute from "./MedicationRoute";

const router = Router();

router.use("/drone", DroneRoute);
router.use("/medication", MedicationRoute);
export default router;
