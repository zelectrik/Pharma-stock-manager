import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

type CreatePharmacyData = {
  name: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
};

type CreatePharmacyAdminData = {
  pharmacyId: string;
  email: string;
  password: string;
};

export const getPharmacies = async () => {
  return await prisma.pharmacy.findMany({
    orderBy: {
      name: "asc",
    },
  });
};
export const createPharmacy = async (data: CreatePharmacyData) => {
  try {
    return await prisma.pharmacy.create({
      data,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Pharmacy with this email already exists", {
        cause: "PHARMACY_ALREADY_EXISTS",
      });
    }
    throw error;
  }
};

export const createPharmacyAdmin = async (data: CreatePharmacyAdminData) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        role: UserRole.PHARMACY_ADMIN,
        pharmacyId: data.pharmacyId,
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      pharmacyId: user.pharmacyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("User with this email already exists", {
        cause: "USER_ALREADY_EXISTS",
      });
    } else if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new Error("Pharmacy not found", {
        cause: "PHARMACY_NOT_FOUND",
      });
    }
    throw error;
  }
};
