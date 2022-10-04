import { Router } from "express";
import { addMedication, getMedications } from "../../controllers/MedicationController";

const router = Router();

router.post("/add", addMedication);
router.get("/all", getMedications);

export default router;
