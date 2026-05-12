import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { getUserById, verifyAuthToken } from "../services/auth.service";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
  pharmacyId: string | null;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authentication token" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = verifyAuthToken(token);
    const user = await getUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid authentication token" });
  }
};

export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  };
};
