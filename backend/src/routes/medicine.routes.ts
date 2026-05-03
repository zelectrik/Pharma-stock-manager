import { Router } from "express";
import {
  createMedicineHandler,
  getMedicinesHandler,
} from "../controllers/medicine.controller";

const router = Router();

router.get("/", getMedicinesHandler);
router.post("/", createMedicineHandler);

export default router;
