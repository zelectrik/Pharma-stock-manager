import { Request, Response } from "express";
import { createMedicineSchema } from "../schemas/medicine.schema";
import { createMedicine } from "../services/medicine.service";

export const createMedicineHandler = (req: Request, res: Response) => {
  const parsed = createMedicineSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  const medicine = createMedicine(parsed.data);

  return res.status(201).json(medicine);
};
