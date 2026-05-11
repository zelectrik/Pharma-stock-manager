import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import InventoryTable from "../../src/components/InventoryTable";
import type { InventoryItemWithAlerts } from "../../src/types/medicine";

const inventory: InventoryItemWithAlerts[] = [
  {
    id: "product-1",
    name: "doliprane",
    threshold: 10,
    totalQuantity: 5,
    alerts: ["LOW_STOCK"],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    batches: [
      {
        id: "batch-1",
        medicineProductId: "product-1",
        quantity: 5,
        expirationDate: "2026-06-30T00:00:00.000Z",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        alerts: ["EXPIRING_SOON"],
      },
    ],
  },
];

describe("InventoryTable", () => {
  it("should render empty state when inventory is empty", () => {
    render(<InventoryTable inventory={[]} />);

    expect(screen.getByText("No inventory yet")).toBeInTheDocument();
  });

  it("should render inventory rows", () => {
    render(<InventoryTable inventory={inventory} />);

    expect(screen.getByText("doliprane")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Low stock")).toBeInTheDocument();
  });

  it("should expand a product row and show batch details", async () => {
    const user = userEvent.setup();

    render(<InventoryTable inventory={inventory} />);

    expect(screen.queryByText("Expiring soon")).not.toBeInTheDocument();

    await user.click(screen.getByText("doliprane"));

    expect(screen.getByText("Batches")).toBeInTheDocument();
    expect(screen.getByText("Expiring soon")).toBeInTheDocument();
  });
});
