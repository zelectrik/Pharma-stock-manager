import { Request, Response } from "express";
import {
  createPharmacyAdminSchema,
  createPharmacySchema,
} from "../schemas/admin.schema";
import {
  createPharmacy,
  createPharmacyAdmin,
  getPharmacies,
} from "../services/admin.service";

export const getPharmaciesHandler = async (req: Request, res: Response) => {
  try {
    const pharmacies = await getPharmacies();
    return res.json(pharmacies);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch pharmacies" });
  }
};

export const createPharmacyHandler = async (req: Request, res: Response) => {
  const parsed = createPharmacySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  try {
    const pharmacy = await createPharmacy(parsed.data);
    return res.status(201).json(pharmacy);
  } catch (error) {
    if (error instanceof Error && error.cause === "PHARMACY_ALREADY_EXISTS") {
      return res.status(409).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to create pharmacy",
    });
  }
};

export const createPharmacyAdminHandler = async (
  req: Request,
  res: Response,
) => {
  const { pharmacyId } = req.params;

  if (typeof pharmacyId !== "string" || pharmacyId.trim() === "") {
    return res.status(400).json({
      error: "Invalid pharmacy id",
    });
  }
  const parsed = createPharmacyAdminSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  try {
    const pharmacyAdmin = await createPharmacyAdmin({
      pharmacyId: pharmacyId,
      ...parsed.data,
    });
    return res.status(201).json(pharmacyAdmin);
  } catch (error) {
    if (error instanceof Error && error.cause === "USER_ALREADY_EXISTS") {
      return res.status(409).json({
        error: error.message,
      });
    } else if (error instanceof Error && error.cause === "PHARMACY_NOT_FOUND") {
      return res.status(404).json({
        error: error.message,
      });
    }
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to create pharmacy admin",
    });
  }
};
