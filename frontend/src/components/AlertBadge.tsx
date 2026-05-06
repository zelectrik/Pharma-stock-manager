import type { MedicineAlert } from "../types/medicine";

type Props = {
  alert: MedicineAlert | "OK";
};

const alertLabels: Record<MedicineAlert | "OK", string> = {
  OK: "OK",
  OUT_OF_STOCK: "Out of stock",
  LOW_STOCK: "Low stock",
  EXPIRING_SOON: "Expiring soon",
  EXPIRED: "Expired",
};

export default function AlertBadge({ alert }: Props) {
  return (
    <span className={`badge ${alert.toLowerCase()}`}>{alertLabels[alert]}</span>
  );
}
