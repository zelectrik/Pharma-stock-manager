import { Router } from "express";
import {
  createMedicineProductHandler,
  createMedicineBatchHandler,
  getMedicineProductsHandler,
  getInventoryHandler,
  getInventoryWithAlertsHandler,
} from "../controllers/medicine.controller";

const router = Router();

//products
router.get("/products", getMedicineProductsHandler);
router.post("/products", createMedicineProductHandler);

// batches
router.post("/products/:medicineProductId/batches", createMedicineBatchHandler);

// inventory
router.get("/inventory/alerts", getInventoryWithAlertsHandler);
router.get("/inventory", getInventoryHandler);

export default router;
