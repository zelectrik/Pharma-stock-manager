import { Router } from "express";
import {
  createPharmacyMedicineHandler,
  createMedicineBatchHandler,
  getPharmacyMedicinesHandler,
  getInventoryHandler,
  getInventoryWithAlertsHandler,
} from "../controllers/medicine.controller";

const router = Router();

//products
router.get("/products", getPharmacyMedicinesHandler);
router.post("/products", createPharmacyMedicineHandler);

// batches
router.post(
  "/products/:pharmacyMedicineId/batches",
  createMedicineBatchHandler,
);

// inventory
router.get("/inventory/alerts", getInventoryWithAlertsHandler);
router.get("/inventory", getInventoryHandler);

export default router;
