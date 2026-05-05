import { z } from "zod";

export const createMedicineBatchSchema = z.object({
  medicineProductId: z.string().min(1),
  quantity: z.number().int().min(0),
  expirationDate: z.string().date(),
});
