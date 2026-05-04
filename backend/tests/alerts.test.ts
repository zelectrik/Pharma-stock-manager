import request from "supertest";
import { beforeEach, afterAll, describe, it, expect } from "vitest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";
import { clearTestDatabase } from "./helpers/database";

describe("GET /medicines/alerts", () => {
  const dateInDays = (days: number) => {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
  };

  it("should return correct alerts for medicines", async () => {
    await request(app)
      .post("/medicines")
      .send({
        name: "Out of stock",
        stock: 0,
        threshold: 5,
        expirationDate: dateInDays(31),
      });

    await request(app)
      .post("/medicines")
      .send({
        name: "Low stock",
        stock: 2,
        threshold: 5,
        expirationDate: dateInDays(31),
      });

    await request(app)
      .post("/medicines")
      .send({
        name: "Expiring soon",
        stock: 10,
        threshold: 5,
        expirationDate: dateInDays(10),
      });

    await request(app)
      .post("/medicines")
      .send({
        name: "Expired",
        stock: 10,
        threshold: 5,
        expirationDate: dateInDays(-10),
      });

    await request(app)
      .post("/medicines")
      .send({
        name: "Expiring soon and Low stock",
        stock: 2,
        threshold: 5,
        expirationDate: dateInDays(10),
      });

    const response = await request(app).get("/medicines/alerts");

    expect(response.status).toBe(200);

    expect(response.body).toEqual([
      expect.objectContaining({
        name: "Out of stock",
        alerts: ["OUT_OF_STOCK"],
      }),
      expect.objectContaining({ name: "Low stock", alerts: ["LOW_STOCK"] }),
      expect.objectContaining({
        name: "Expiring soon",
        alerts: ["EXPIRING_SOON"],
      }),
      expect.objectContaining({
        name: "Expired",
        alerts: ["EXPIRED"],
      }),
      expect.objectContaining({
        name: "Expiring soon and Low stock",
        alerts: expect.arrayContaining(["LOW_STOCK", "EXPIRING_SOON"]),
      }),
    ]);
  });
});
