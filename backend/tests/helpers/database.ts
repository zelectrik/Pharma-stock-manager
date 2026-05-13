import { prisma } from "../../src/lib/prisma";
import bcrypt from "bcryptjs";
import request from "supertest";
import { expect } from "vitest";
import { app } from "../../src/app";
import { Pharmacy, User } from "@prisma/client";

type TestAccountSetup = {
  superAdmin: User | null;
  pharmacy: Pharmacy | null;
  pharmacyAdmin: User | null;
};

export const clearTestDatabase = async () => {
  await prisma.medicineBatch.deleteMany();
  await prisma.pharmacyMedicine.deleteMany();
  await prisma.medicineProduct.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pharmacy.deleteMany();
};

export const createSuperAdmin = async () => {
  const passwordHash = await bcrypt.hash("password123", 10);

  return prisma.user.create({
    data: {
      email: "admin@example.com",
      passwordHash,
      role: "SUPER_ADMIN",
      pharmacyId: null,
    },
  });
};

export const getSuperAdminToken = async () => {
  return await getUserToken({
    email: "admin@example.com",
    password: "password123",
  });
};

export const getUserToken = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await request(app).post("/auth/login").send({
    email,
    password,
  });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("token");

  return response.body.token as string;
};

export const getDefaultName = (suffix: string) => `Pharma${suffix}`;

export const getPharmacyData = (pharmacyName: string) => ({
  name: pharmacyName,
  email: `${pharmacyName.toLowerCase().replace(" ", "")}@pharma-stock.test`,
  address: `1 ${pharmacyName.toLowerCase().replace(" ", "")} street`,
  city: "Seynod",
  zipCode: "74000",
  country: "France",
});

export const getPharmacyAdminData = (
  pharmacyId: string,
  pharmacyName: string,
) => ({
  email: `admin${pharmacyName.toLowerCase()}@pharma-stock.test`,
  password: `PWD${pharmacyName}`,
  pharmacyId,
});

export const getPharmacyAdminLoginData = (pharmacyName: string) => ({
  email: `admin${pharmacyName.toLowerCase()}@pharma-stock.test`,
  password: `PWD${pharmacyName}`,
});

export const setupTestAccount = async (
  shouldCreateSuperAdmin: boolean,
  shouldCreatePharmacy: boolean,
  shouldCreatePharmacyAdmin: boolean,
): Promise<TestAccountSetup> => {
  const result: TestAccountSetup = {
    superAdmin: null,
    pharmacy: null,
    pharmacyAdmin: null,
  };

  if (shouldCreateSuperAdmin) {
    result.superAdmin = await createSuperAdmin();
  }

  if (shouldCreatePharmacy) {
    result.pharmacy = await prisma.pharmacy.create({
      data: getPharmacyData(getDefaultName("1")),
    });
  }

  if (shouldCreatePharmacyAdmin) {
    const pharmacy = result.pharmacy;
    if (!pharmacy) {
      throw new Error("Cannot create pharmacy admin without a pharmacy");
    }
    const pharmacyAdminData = getPharmacyAdminData(
      pharmacy.id,
      getDefaultName("1"),
    );
    const passwordHash = await bcrypt.hash(pharmacyAdminData.password, 10);
    result.pharmacyAdmin = await prisma.user.create({
      data: {
        email: pharmacyAdminData.email,
        passwordHash,
        role: "PHARMACY_ADMIN",
        pharmacyId: pharmacy.id,
      },
    });
  }

  return result;
};
