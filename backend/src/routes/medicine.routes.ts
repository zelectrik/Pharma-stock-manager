import { Router } from "express";
import {
  createMedicineProductHandler,
  createMedicineBatchHandler,
  getMedicineProductsHandler,
  getInventoryHandler,
  getInventoryWithAlertsHandler,
} from "../controllers/medicine.controller";

const router = Router();

router.get("/inventory/alerts", getInventoryWithAlertsHandler);
router.get("/inventory", getInventoryHandler);
router.get("/products", getMedicineProductsHandler);
router.post("/products", createMedicineProductHandler);
router.post("/batches", createMedicineBatchHandler);

export default router;
