import { Router } from "express";
import {
  createPharmacyMedicineHandler,
  createMedicineBatchHandler,
  getPharmacyMedicinesHandler,
  getInventoryHandler,
  getInventoryWithAlertsHandler,
} from "../controllers/medicine.controller";

const router = Router();

//medicines
router.get("/medicines", getPharmacyMedicinesHandler);
router.post("/medicines", createPharmacyMedicineHandler);

// batches
router.post(
  "/medicines/:pharmacyMedicineId/batches",
  createMedicineBatchHandler,
);

// inventory
router.get("/inventory/alerts", getInventoryWithAlertsHandler);
router.get("/inventory", getInventoryHandler);

export default router;
