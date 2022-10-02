import { Router } from "express";
import DroneRoute from "./DispatchRoute";

const router = Router();

router.use("/drone", DroneRoute);
export default router;
