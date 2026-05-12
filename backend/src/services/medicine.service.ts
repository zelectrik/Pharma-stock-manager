import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export type MedicineAlert =
  | "OUT_OF_STOCK"
  | "LOW_STOCK"
  | "EXPIRING_SOON"
  | "EXPIRED";

type CreatePharmacyMedicineInput = {
  name: string;
  threshold: number;
};

type CreateMedicineBatchInput = {
  pharmacyMedicineId: string;
  quantity: number;
  expirationDate: string;
};

const getDefaultPharmacy = async () => {
  return prisma.pharmacy.upsert({
    where: { email: "default@pharma-stock.local" },
    update: {},
    create: {
      name: "Default Pharmacy",
      email: "default@pharma-stock.local",
      address: "1 demo street",
      city: "Annecy",
      zipCode: "74000",
      country: "France",
    },
  });
};

export const createPharmacyMedicine = async (
  data: CreatePharmacyMedicineInput,
) => {
  const pharmacy = await getDefaultPharmacy();
  const formattedName = data.name.trim().toLowerCase();
  const medicineProduct = await prisma.medicineProduct.upsert({
    where: {
      name: formattedName,
    },
    update: {},
    create: {
      name: formattedName,
    },
  });

  try {
    const pharmacyMedicine = await prisma.pharmacyMedicine.create({
      data: {
        threshold: data.threshold,
        pharmacyId: pharmacy.id,
        medicineProductId: medicineProduct.id,
      },
      include: {
        medicineProduct: true,
      },
    });

    return {
      id: pharmacyMedicine.id,
      medicineProductId: pharmacyMedicine.medicineProductId,
      name: pharmacyMedicine.medicineProduct.name,
      threshold: pharmacyMedicine.threshold,
      createdAt: pharmacyMedicine.createdAt,
      updatedAt: pharmacyMedicine.updatedAt,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Medicine already tracked by this pharmacy", {
        cause: "DUPLICATE_PHARMACY_MEDICINE",
      });
    }
    throw error;
  }
};

export const createMedicineBatch = async (data: CreateMedicineBatchInput) => {
  try {
    return await prisma.medicineBatch.create({
      data: {
        pharmacyMedicineId: data.pharmacyMedicineId,
        quantity: data.quantity,
        expirationDate: new Date(data.expirationDate),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new Error("Pharmacy medicine not found", {
        cause: "PHARMACY_MEDICINE_NOT_FOUND",
      });
    }

    throw error;
  }
};

export const getPharmacyMedicines = async () => {
  const pharmacy = await getDefaultPharmacy();
  const pharmacyMedicines = await prisma.pharmacyMedicine.findMany({
    where: { pharmacyId: pharmacy.id },
    include: {
      medicineProduct: true,
    },
    orderBy: {
      medicineProduct: {
        name: "asc",
      },
    },
  });
  return pharmacyMedicines.map((pharmacyMedicine) => ({
    id: pharmacyMedicine.id,
    medicineProductId: pharmacyMedicine.medicineProductId,
    name: pharmacyMedicine.medicineProduct.name,
    threshold: pharmacyMedicine.threshold,
    createdAt: pharmacyMedicine.createdAt,
    updatedAt: pharmacyMedicine.updatedAt,
  }));
};

export const getInventory = async () => {
  const pharmacy = await getDefaultPharmacy();
  const pharmacyMedicines = await prisma.pharmacyMedicine.findMany({
    where: { pharmacyId: pharmacy.id },
    orderBy: {
      medicineProduct: {
        name: "asc",
      },
    },
    include: {
      batches: {
        orderBy: {
          expirationDate: "asc",
        },
      },
      medicineProduct: true,
    },
  });

  return pharmacyMedicines.map((pharmacyMedicine) => {
    const totalQuantity = pharmacyMedicine.batches.reduce(
      (sum, batch) => sum + batch.quantity,
      0,
    );

    return {
      id: pharmacyMedicine.id,
      medicineProductId: pharmacyMedicine.medicineProductId,
      name: pharmacyMedicine.medicineProduct.name,
      threshold: pharmacyMedicine.threshold,
      totalQuantity,
      batches: pharmacyMedicine.batches,
      createdAt: pharmacyMedicine.createdAt,
      updatedAt: pharmacyMedicine.updatedAt,
    };
  });
};

export const getInventoryWithAlerts = async () => {
  const inventory = await getInventory();
  const now = new Date();

  return inventory.map((item) => {
    const alerts: MedicineAlert[] = [];
    if (item.totalQuantity === 0) {
      alerts.push("OUT_OF_STOCK");
    } else if (item.totalQuantity < item.threshold) {
      alerts.push("LOW_STOCK");
    }

    const batchesWithAlerts = item.batches.map((batch) => {
      const batchAlerts: MedicineAlert[] = [];
      const expiration = new Date(batch.expirationDate);
      const daysBeforeExpiration =
        (expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

      if (daysBeforeExpiration < 30 && daysBeforeExpiration >= 0) {
        batchAlerts.push("EXPIRING_SOON");
      } else if (daysBeforeExpiration < 0) {
        batchAlerts.push("EXPIRED");
      }

      return {
        ...batch,
        alerts: batchAlerts,
      };
    });

    const hasExpiredBatch = batchesWithAlerts.some((batch) =>
      batch.alerts.includes("EXPIRED"),
    );
    const hasExpiringSoonBatch = batchesWithAlerts.some((batch) =>
      batch.alerts.includes("EXPIRING_SOON"),
    );

    if (hasExpiredBatch) {
      alerts.push("EXPIRED");
    }
    if (hasExpiringSoonBatch) {
      alerts.push("EXPIRING_SOON");
    }

    return {
      ...item,
      batches: batchesWithAlerts,
      alerts,
    };
  });
};
