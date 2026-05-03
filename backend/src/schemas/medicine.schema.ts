import { z } from "zod";

export const createMedicineSchema = z.object({
  name: z.string().min(1),
  stock: z.number().int().min(0),
  threshold: z.number().int().min(0),
  expirationDate: z.string().date(),
});
