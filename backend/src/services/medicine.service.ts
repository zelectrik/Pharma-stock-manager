import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export type MedicineAlert =
  | "OUT_OF_STOCK"
  | "LOW_STOCK"
  | "EXPIRING_SOON"
  | "EXPIRED";

type CreateMedicineProductInput = {
  name: string;
  threshold: number;
};

type CreateMedicineBatchInput = {
  medicineProductId: string;
  quantity: number;
  expirationDate: string;
};

export const createMedicineProduct = async (
  data: CreateMedicineProductInput,
) => {
  try {
    return await prisma.medicineProduct.create({
      data: {
        name: data.name.trim().toLowerCase(),
        threshold: data.threshold,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Medicine type name already exists", {
        cause: "DUPLICATE_NAME",
      });
    }
    throw error;
  }
};

export const createMedicineBatch = async (data: CreateMedicineBatchInput) => {
  try {
    return await prisma.medicineBatch.create({
      data: {
        medicineProductId: data.medicineProductId,
        quantity: data.quantity,
        expirationDate: new Date(data.expirationDate),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new Error("Medicine product not found", {
        cause: "PRODUCT_NOT_FOUND",
      });
    }

    throw error;
  }
};

export const getMedicineProducts = async () => {
  return prisma.medicineProduct.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const getInventory = async () => {
  const products = await prisma.medicineProduct.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      batches: {
        orderBy: {
          expirationDate: "asc",
        },
      },
    },
  });

  return products.map((product) => {
    const totalQuantity = product.batches.reduce(
      (acc, b) => acc + b.quantity,
      0,
    );

    return {
      ...product,
      totalQuantity: totalQuantity,
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
