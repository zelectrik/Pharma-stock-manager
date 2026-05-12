import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";

type loginInput = {
  email: string;
  password: string;
};

type JwtPayload = {
  userId: string;
  role: UserRole;
};

type SafeUser = {
  id: string;
  email: string;
  role: UserRole;
  pharmacyId: string | null;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
};

const normalizeEmail = (email: string) => {
  return email.trim().toLowerCase();
};

const toSafeUser = (user: SafeUser): SafeUser => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    pharmacyId: user.pharmacyId,
  };
};

export const login = async (data: loginInput) => {
  const email = normalizeEmail(data.email);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials", {
      cause: "INVALID_CREDENTIALS",
    });
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );
  if (!passwordMatches) {
    throw new Error("Invalid credentials", {
      cause: "INVALID_CREDENTIALS",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    } satisfies JwtPayload,
    getJwtSecret(),
    {
      expiresIn: "1h",
    },
  );

  return {
    token,
    user: toSafeUser(user),
  };
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  return toSafeUser(user);
};

export const verifyAuthToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};
