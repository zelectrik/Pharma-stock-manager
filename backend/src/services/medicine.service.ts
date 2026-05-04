import { prisma } from "../lib/prisma";

export type MedicineAlert =
  | "OUT_OF_STOCK"
  | "LOW_STOCK"
  | "EXPIRING_SOON"
  | "EXPIRED";

type CreateMedicineInput = {
  name: string;
  stock: number;
  threshold: number;
  expirationDate: string;
};

export const createMedicine = async (data: CreateMedicineInput) => {
  return prisma.medicine.create({
    data: {
      name: data.name,
      stock: data.stock,
      threshold: data.threshold,
      expirationDate: new Date(data.expirationDate),
    },
  });
};

export const getMedicines = async () => {
  return prisma.medicine.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getMedicineAlerts = async () => {
  const medicines = await getMedicines();
  const now = new Date();

  return medicines.map((medicine) => {
    const expiration = new Date(medicine.expirationDate);

    const daysBeforeExpiration =
      (expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    const alerts: MedicineAlert[] = [];
    if (medicine.stock === 0) {
      alerts.push("OUT_OF_STOCK");
    } else if (medicine.stock < medicine.threshold) {
      alerts.push("LOW_STOCK");
    }

    if (daysBeforeExpiration < 0) {
      alerts.push("EXPIRED");
    } else if (daysBeforeExpiration < 30) {
      alerts.push("EXPIRING_SOON");
    }

    return {
      ...medicine,
      alerts,
    };
  });
};
