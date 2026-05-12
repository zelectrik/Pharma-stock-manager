import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

const futureDate = (days: number) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

const pastDate = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

const createProduct = async (name: string, threshold: number) => {
  const response = await request(app).post("/pharmacy/medicines").send({
    name,
    threshold,
  });

  expect(response.status).toBe(201);

  return response.body;
};

const createBatch = async (
  medicineProductId: string,
  quantity: number,
  expirationDate: string,
) => {
  return request(app)
    .post(`/pharmacy/medicines/${medicineProductId}/batches`)
    .send({
      quantity,
      expirationDate,
    });
};

describe("GET /pharmacy/inventory/alerts", () => {
  it("should return correct inventory alerts for products and batches", async () => {
    const outOfStock = await createProduct("Out of stock", 5);

    const lowStock = await createProduct("Low stock", 10);
    await createBatch(lowStock.id, 5, futureDate(60));

    const expiringSoon = await createProduct("Expiring soon", 5);
    await createBatch(expiringSoon.id, 20, futureDate(10));

    const expired = await createProduct("Expired", 5);
    await createBatch(expired.id, 20, pastDate(10));

    const lowStockAndExpiringSoon = await createProduct(
      "Low stock and expiring soon",
      20,
    );
    await createBatch(lowStockAndExpiringSoon.id, 5, futureDate(10));

    const response = await request(app).get("/pharmacy/inventory/alerts");

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: outOfStock.id,
          name: "out of stock",
          totalQuantity: 0,
          alerts: ["OUT_OF_STOCK"],
        }),
        expect.objectContaining({
          id: lowStock.id,
          name: "low stock",
          totalQuantity: 5,
          alerts: ["LOW_STOCK"],
        }),
        expect.objectContaining({
          id: expiringSoon.id,
          name: "expiring soon",
          totalQuantity: 20,
          alerts: ["EXPIRING_SOON"],
        }),
        expect.objectContaining({
          id: expired.id,
          name: "expired",
          totalQuantity: 20,
          alerts: ["EXPIRED"],
        }),
        expect.objectContaining({
          id: lowStockAndExpiringSoon.id,
          name: "low stock and expiring soon",
          totalQuantity: 5,
          alerts: expect.arrayContaining(["LOW_STOCK", "EXPIRING_SOON"]),
        }),
      ]),
    );
  });

  it("should return batch-level alerts inside inventory items", async () => {
    const product = await createProduct("Doliprane", 10);

    await createBatch(product.id, 5, pastDate(3));
    await createBatch(product.id, 20, futureDate(5));

    const response = await request(app).get("/pharmacy/inventory/alerts");

    expect(response.status).toBe(200);

    const item = response.body.find(
      (inventoryItem: { id: string }) => inventoryItem.id === product.id,
    );

    expect(item).toBeDefined();
    expect(item.batches).toHaveLength(2);

    expect(item.batches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alerts: ["EXPIRED"],
        }),
        expect.objectContaining({
          alerts: ["EXPIRING_SOON"],
        }),
      ]),
    );

    expect(item.alerts).toEqual(
      expect.arrayContaining(["EXPIRED", "EXPIRING_SOON"]),
    );
  });
});
