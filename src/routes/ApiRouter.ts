import { Router } from "express";
import APIv1IndexRouter from "./v1";

const router = Router();

router.use("/v1", APIv1IndexRouter);

export default router;