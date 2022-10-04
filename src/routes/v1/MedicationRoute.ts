import { Router } from "express";
import { getMedications } from "../../controllers/MedicationController";

const router = Router();

router.get("/all", getMedications);

export default router;
