import { Medicine } from "../types/medicine";
import { randomUUID } from "crypto";

const medicines: Medicine[] = [];

export const createMedicine = (data: Omit<Medicine, "id">): Medicine => {
  const newMedicine: Medicine = {
    id: randomUUID(),
    ...data,
  };

  medicines.push(newMedicine);

  return newMedicine;
};

export const clearMedecines = () => {
  medicines.length = 0;
};

export const getMedicines = () => medicines;
