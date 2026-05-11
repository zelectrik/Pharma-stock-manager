import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../src/App";
import * as medicinesApi from "../src/api/medicinesApi";

vi.mock("../src/api/medicinesApi");

const mockedApi = vi.mocked(medicinesApi);

describe("App", () => {
  beforeEach(() => {
    mockedApi.getMedicineProducts.mockResolvedValue([
      {
        id: "product-1",
        name: "doliprane",
        threshold: 10,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ]);

    mockedApi.getInventoryWithAlerts.mockResolvedValue([
      {
        id: "product-1",
        name: "doliprane",
        threshold: 10,
        totalQuantity: 5,
        alerts: ["LOW_STOCK"],
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        batches: [],
      },
    ]);

    mockedApi.createMedicineProduct.mockResolvedValue({
      id: "product-2",
      name: "ibuprofene",
      threshold: 5,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    mockedApi.createMedicineBatch.mockResolvedValue({
      id: "batch-1",
      medicineProductId: "product-1",
      quantity: 10,
      expirationDate: "2026-06-30T00:00:00.000Z",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
  });

  it("should render inventory by default", async () => {
    render(<App />);

    expect(screen.getByText("Pharma Stock Manager")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("doliprane")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: "Inventory" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Low stock")).toBeInTheDocument();
  });

  it("should switch to alerts tab", async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("doliprane")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Alerts" }));

    expect(screen.getByText("Products with alerts")).toBeInTheDocument();
    expect(screen.getByText("doliprane")).toBeInTheDocument();
  });

  it("should switch to add product tab", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Add product" }));

    expect(screen.getByText("Add medicine product")).toBeInTheDocument();
    expect(screen.getByLabelText("Medicine name")).toBeInTheDocument();
  });

  it("should switch to add batch tab", async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(mockedApi.getMedicineProducts).toHaveBeenCalled();
    });

    await user.click(screen.getByRole("button", { name: "Add batch" }));

    expect(screen.getByText("Add stock batch")).toBeInTheDocument();
    expect(screen.getByLabelText("Medicine product")).toBeInTheDocument();
    expect(screen.getByText("doliprane")).toBeInTheDocument();
  });
});
