export type PharmacyMedicine = {
  id: string;
  medicineProductId: string;
  name: string;
  threshold: number;
  createdAt: string;
  updatedAt: string;
};

export type MedicineBatch = {
  id: string;
  pharmacyMedicineId: string;
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

export type MedicineBatchWithAlerts = MedicineBatch & {
  alerts: MedicineAlert[];
};

export type InventoryItem = PharmacyMedicine & {
  totalQuantity: number;
  batches: MedicineBatch[];
};

export type InventoryItemWithAlerts = PharmacyMedicine & {
  totalQuantity: number;
  alerts: MedicineAlert[];
  batches: MedicineBatchWithAlerts[];
};
