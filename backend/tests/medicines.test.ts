import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app";

describe("POST /medicines", () => {
  it("should create a medicine and return 201", async () => {
    const payload = {
      name: "Doliprane",
      stock: 100,
      threshold: 10,
      expirationDate: "2026-01-01",
    };

    const response = await request(app).post("/medicines").send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(payload);
    expect(response.body).toHaveProperty("id");
  });

  it.each([
    ["empty payload", {}],
    [
      "empty name",
      {
        name: "",
        stock: 10,
        threshold: 5,
        expirationDate: "2026-01-01",
      },
    ],
    [
      "negative stock",
      {
        name: "Doliprane",
        stock: -1,
        threshold: 5,
        expirationDate: "2026-01-01",
      },
    ],
    [
      "invalid expiration date",
      {
        name: "Doliprane",
        stock: 10,
        threshold: 5,
        expirationDate: "invalid-date",
      },
    ],
  ])(
    "should return 400 for invalid payload: %s",
    async (_caseName, payload) => {
      const response = await request(app).post("/medicines").send(payload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    },
  );
});
