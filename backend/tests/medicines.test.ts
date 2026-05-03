import request from "supertest";
import { beforeEach, describe, it, expect } from "vitest";
import { app } from "../src/app";
import { clearMedecines } from "../src/services/medicine.service";

beforeEach(() => {
  clearMedecines();
});

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

describe("GET /medicines", () => {
  it("should return all created medicines", async () => {
    const firstPayload = {
      name: "Doliprane",
      stock: 100,
      threshold: 10,
      expirationDate: "2026-01-01",
    };

    const secondPayload = {
      name: "Ibuprofene",
      stock: 50,
      threshold: 5,
      expirationDate: "2026-06-01",
    };

    const firstCreateResponse = await request(app)
      .post("/medicines")
      .send(firstPayload);

    const getResponse1 = await request(app).get("/medicines");

    expect(getResponse1.status).toBe(200);
    expect(getResponse1.body).toEqual([firstCreateResponse.body]);

    const secondCreateResponse = await request(app)
      .post("/medicines")
      .send(secondPayload);

    const getResponse2 = await request(app).get("/medicines");

    expect(getResponse2.status).toBe(200);
    expect(getResponse2.body).toEqual([
      firstCreateResponse.body,
      secondCreateResponse.body,
    ]);
  });
});
