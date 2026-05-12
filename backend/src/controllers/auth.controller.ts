import { Request, Response } from "express";
import { loginSchema } from "../schemas/auth.schema";
import { login } from "../services/auth.service";

export const loginHandler = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  try {
    const result = await login(parsed.data);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.cause === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to login",
    });
  }
};
