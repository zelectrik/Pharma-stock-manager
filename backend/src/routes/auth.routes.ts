import { Router } from "express";
import { loginHandler } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", loginHandler);
router.get("/me", requireAuth, (req, res) => {
  return res.status(200).json(req.user);
});

export default router;
