import { Router } from "express";
import { MedicationService } from "../../services/MedicationService";
import { MedicationController } from "../../controllers/MedicationController";

const medicationService: MedicationService = new MedicationService();
const medicationController: MedicationController = new MedicationController(
  medicationService
);
const router = Router();

router.post("/add", medicationController.addMedication);
router.get("/all", medicationController.getMedications);

export default router;
