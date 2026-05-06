export type MedicineProduct = {
  id: string;
  name: string;
  threshold: number;
  createdAt: string;
  updatedAt: string;
};

export type MedicineBatch = {
  id: string;
  medicineProductId: string;
  quantity: number;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
};

export type MedicineAlert =
  | "OUT_OF_STOCK"
  | "LOW_STOCK"
  | "EXPIRING_SOON"
  | "EXPIRED";

export type MedicineBacthWithAlerts = MedicineBatch & {
  alerts: MedicineAlert[];
};

export type InventoryItem = MedicineProduct & {
  totalQuantity: number;
  batches: MedicineBatch[];
};

export type InventoryItemWithAlerts = MedicineProduct & {
  totalQuantity: number;
  alerts: MedicineAlert[];
  batches: MedicineBacthWithAlerts[];
};
