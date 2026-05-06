export type Medicine = {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
};

export type MedicineAlert = {
  id: string;
  alerts: string[];
};
