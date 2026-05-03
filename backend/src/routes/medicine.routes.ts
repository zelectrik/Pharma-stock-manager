import { Router } from "express";
import {
  createMedicineHandler,
  getMedicinesHandler,
  getMedicineAlertsHandler,
} from "../controllers/medicine.controller";

const router = Router();

router.get("/alerts", getMedicineAlertsHandler);
router.get("/", getMedicinesHandler);

router.post("/", createMedicineHandler);

export default router;
