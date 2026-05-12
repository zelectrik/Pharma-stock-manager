import { z } from "zod";

export const createPharmacyMedicineSchema = z.object({
  name: z.string().min(1),
  threshold: z.number().int().min(0),
});
