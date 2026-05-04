import { Request, Response } from "express";
import { createMedicineSchema } from "../schemas/medicine.schema";
import {
  createMedicine,
  getMedicines,
  getMedicineAlerts,
} from "../services/medicine.service";

export const createMedicineHandler = async (req: Request, res: Response) => {
  const parsed = createMedicineSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  const medicine = await createMedicine(parsed.data);

  return res.status(201).json(medicine);
};

export const getMedicinesHandler = async (_req: Request, res: Response) => {
  const medicines = await getMedicines();
  return res.status(200).json(medicines);
};

export const getMedicineAlertsHandler = async (
  _req: Request,
  res: Response,
) => {
  const medicineAlerts = await getMedicineAlerts();
  return res.status(200).json(medicineAlerts);
};
