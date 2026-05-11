import { Request, Response } from "express";
import { createPharmacyMedicineSchema } from "../schemas/pharmacyMedicine.schema";
import { createMedicineBatchSchema } from "../schemas/medicineBatch.schema";
import {
  createPharmacyMedicine,
  createMedicineBatch,
  getPharmacyMedicines,
  getInventory,
  getInventoryWithAlerts,
} from "../services/medicine.service";

export const createPharmacyMedicineHandler = async (
  req: Request,
  res: Response,
) => {
  const parsed = createPharmacyMedicineSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  try {
    const medicineProduct = await createPharmacyMedicine(parsed.data);

    return res.status(201).json(medicineProduct);
  } catch (error) {
    if (
      error instanceof Error &&
      error.cause === "DUPLICATE_PHARMACY_MEDICINE"
    ) {
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
  const { pharmacyMedicineId } = req.params;

  if (typeof pharmacyMedicineId !== "string") {
    return res.status(400).json({
      error: "Invalid pharmacy medicine id",
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
      pharmacyMedicineId,
    });
    return res.status(201).json(medicineBatch);
  } catch (error) {
    if (
      error instanceof Error &&
      error.cause === "PHARMACY_MEDICINE_NOT_FOUND"
    ) {
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

export const getPharmacyMedicinesHandler = async (
  _req: Request,
  res: Response,
) => {
  const medicines = await getPharmacyMedicines();
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
