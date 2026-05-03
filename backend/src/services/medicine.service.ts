import { Medicine } from "../types/medicine";
import { randomUUID } from "crypto";

export type MedicineAlert =
  | "OUT_OF_STOCK"
  | "LOW_STOCK"
  | "EXPIRING_SOON"
  | "EXPIRED";

const medicines: Medicine[] = [];

export const createMedicine = (data: Omit<Medicine, "id">): Medicine => {
  const newMedicine: Medicine = {
    id: randomUUID(),
    ...data,
  };

  medicines.push(newMedicine);

  return newMedicine;
};

export const getMedicines = () => medicines;

export const getMedicineAlerts = () => {
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

// For testing purpose only
export const clearMedicines = () => {
  medicines.length = 0;
};
