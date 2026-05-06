import { Request, Response } from "express";
import { createMedicineProductSchema } from "../schemas/medicineProduct.schema";
import { createMedicineBatchSchema } from "../schemas/medicineBatch.schema";
import {
  createMedicineProduct,
  createMedicineBatch,
  getMedicineProducts,
  getInventory,
  getInventoryWithAlerts,
} from "../services/medicine.service";

export const createMedicineProductHandler = async (
  req: Request,
  res: Response,
) => {
  const parsed = createMedicineProductSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  try {
    const medicineProduct = await createMedicineProduct(parsed.data);

    return res.status(201).json(medicineProduct);
  } catch (error) {
    if (error instanceof Error && error.cause === "DUPLICATE_NAME") {
      return res.status(409).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to create medicine product",
    });
  }
};

export const createMedicineBatchHandler = async (
  req: Request,
  res: Response,
) => {
  const { medicineProductId } = req.params;

  if (typeof medicineProductId !== "string") {
    return res.status(400).json({
      error: "Invalid medicine product id",
    });
  }

  const parsed = createMedicineBatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  try {
    const medicineBatch = await createMedicineBatch({
      ...parsed.data,
      medicineProductId,
    });
    return res.status(201).json(medicineBatch);
  } catch (error) {
    if (error instanceof Error && error.cause === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to create medicine batch",
    });
  }
};

export const getMedicineProductsHandler = async (
  _req: Request,
  res: Response,
) => {
  const medicines = await getMedicineProducts();
  return res.status(200).json(medicines);
};

export const getInventoryHandler = async (_req: Request, res: Response) => {
  const inventory = await getInventory();
  return res.status(200).json(inventory);
};

export const getInventoryWithAlertsHandler = async (
  _req: Request,
  res: Response,
) => {
  const inventory = await getInventoryWithAlerts();
  return res.status(200).json(inventory);
};
