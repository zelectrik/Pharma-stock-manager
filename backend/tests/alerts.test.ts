import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import { app } from "../src/app";
import { clearMedicines } from "../src/services/medicine.service";

describe("GET /medicines/alerts", () => {
  beforeEach(() => {
    clearMedicines();
  });

  it("should return correct alerts for medicines", async () => {
    await request(app).post("/medicines").send({
      name: "Out of stock",
      stock: 0,
      threshold: 5,
      expirationDate: "2026-01-01",
    });

    await request(app).post("/medicines").send({
      name: "Low stock",
      stock: 2,
      threshold: 5,
      expirationDate: "2026-01-01",
    });

    await request(app)
      .post("/medicines")
      .send({
        name: "Expiring soon",
        stock: 10,
        threshold: 5,
        expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });

    const response = await request(app).get("/medicines/alerts");

    expect(response.status).toBe(200);

    expect(response.body).toEqual([
      expect.objectContaining({ name: "Out of stock", alert: "OUT_OF_STOCK" }),
      expect.objectContaining({ name: "Low stock", alert: "LOW_STOCK" }),
      expect.objectContaining({
        name: "Expiring soon",
        alert: "EXPIRING_SOON",
      }),
    ]);
  });
});
