import { z } from "zod";

export const createMedicineBatchSchema = z.object({
  quantity: z.number().int().min(0),
  expirationDate: z.string().date(),
});
