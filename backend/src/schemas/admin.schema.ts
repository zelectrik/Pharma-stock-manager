import { z } from "zod";

export const createPharmacyAdminSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
});

export const createPharmacySchema = z.object({
  name: z.string().min(1),
  email: z.string().trim().toLowerCase().email(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1),
});
