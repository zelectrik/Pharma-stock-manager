import type {
  InventoryItem,
  InventoryItemWithAlerts,
  MedicineBatch,
  MedicineProduct,
} from "../types/medicine";

const API_URL = "/api";

export const getMedicineProducts = async (): Promise<MedicineProduct[]> => {
  const res = await fetch(`${API_URL}/medicines/products`);
  if (!res.ok) throw new Error("Failed to fetch medicine products");
  return res.json();
};

export const createMedicineProduct = async (data: {
  name: string;
  threshold: number;
}): Promise<MedicineProduct> => {
  const res = await fetch(`${API_URL}/medicines/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create medicine product");
  return res.json();
};

export const createMedicineBatch = async (
  medicineProductId: string,
  data: {
    quantity: number;
    expirationDate: string;
  },
): Promise<MedicineBatch> => {
  const res = await fetch(
    `${API_URL}/medicines/products/${medicineProductId}/batches`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) throw new Error("Failed to create medicine batch");
  return res.json();
};

export const getInventory = async (): Promise<InventoryItem[]> => {
  const res = await fetch(`${API_URL}/medicines/inventory`);
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
};

export const getInventoryWithAlerts = async (): Promise<
  InventoryItemWithAlerts[]
> => {
  const res = await fetch(`${API_URL}/medicines/inventory/alerts`);
  if (!res.ok) throw new Error("Failed to fetch inventory alerts");
  return res.json();
};
