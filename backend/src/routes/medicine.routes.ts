import { Router } from "express";
import { createMedicineHandler } from "../controllers/medicine.controller";

const router = Router();

router.post("/", createMedicineHandler);

export default router;
