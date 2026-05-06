import type { Medicine, MedicineAlert } from "../types/medicine";

const API_URL = "/api";

export const getMedicines = async (): Promise<Medicine[]> => {
  const res = await fetch(`${API_URL}/medicines`);
  if (!res.ok) {
    throw new Error("Failed to fetch medicines");
  }
  return res.json();
};

export const getAlerts = async (): Promise<MedicineAlert[]> => {
  const res = await fetch(`${API_URL}/medicines/alerts`);
  if (!res.ok) {
    throw new Error("Failed to fetch alerts");
  }
  return res.json();
};

export const createMedicine = async (
  data: Omit<Medicine, "id" | "createdAt" | "updatedAt">,
) => {
  const res = await fetch(`${API_URL}/medicines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create medicine");
  }
  return res.json();
};
