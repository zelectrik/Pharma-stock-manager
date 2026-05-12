import type {
  InventoryItem,
  InventoryItemWithAlerts,
  MedicineBatch,
  PharmacyMedicine,
} from "../types/medicine";

const API_URL = "/api";

export const getPharmacyMedicines = async (): Promise<PharmacyMedicine[]> => {
  const res = await fetch(`${API_URL}/pharmacy/medicines`);
  if (!res.ok) throw new Error("Failed to fetch pharmacy medicines");
  return res.json();
};

export const createPharmacyMedicine = async (data: {
  name: string;
  threshold: number;
}): Promise<PharmacyMedicine> => {
  const res = await fetch(`${API_URL}/pharmacy/medicines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create pharmacy medicine");
  return res.json();
};

export const createMedicineBatch = async (
  pharmacyMedicineId: string,
  data: {
    quantity: number;
    expirationDate: string;
  },
): Promise<MedicineBatch> => {
  const res = await fetch(
    `${API_URL}/pharmacy/medicines/${pharmacyMedicineId}/batches`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) throw new Error("Failed to create pharmacy medicine batch");
  return res.json();
};

export const getPharmacyInventory = async (): Promise<InventoryItem[]> => {
  const res = await fetch(`${API_URL}/pharmacy/inventory`);
  if (!res.ok) throw new Error("Failed to fetch pharmacy inventory");
  return res.json();
};

export const getPharmacyInventoryWithAlerts = async (): Promise<
  InventoryItemWithAlerts[]
> => {
  const res = await fetch(`${API_URL}/pharmacy/inventory/alerts`);
  if (!res.ok) throw new Error("Failed to fetch pharmacy inventory alerts");
  return res.json();
};
