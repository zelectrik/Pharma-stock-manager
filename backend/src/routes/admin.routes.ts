import { Router } from "express";
import {
  createPharmacyHandler,
  createPharmacyAdminHandler,
  getPharmaciesHandler,
} from "../controllers/admin.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.use(requireAuth);
router.use(requireRole([UserRole.SUPER_ADMIN]));

router.get("/pharmacies", getPharmaciesHandler);
router.post("/pharmacies", createPharmacyHandler);
router.post("/pharmacies/:pharmacyId/admins", createPharmacyAdminHandler);

export default router;
