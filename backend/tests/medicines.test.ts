import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("POST /medicines/products", () => {
  it("should create a medicine product and return 201", async () => {
    const payload = {
      name: "   DoliPrane  ",
      threshold: 10,
    };

    const response = await request(app)
      .post("/medicines/products")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: "doliprane",
      threshold: payload.threshold,
    });
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
  });

  it("should return 409 if medicine product name already exists", async () => {
    const payload = {
      name: "   DoliPrane",
      threshold: 10,
    };

    await request(app).post("/medicines/products").send(payload);

    const response = await request(app).post("/medicines/products").send({
      name: "DOLIPRANE",
      threshold: 20,
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
  });

  it.each([
    ["empty payload", {}],
    ["empty name", { name: "", threshold: 10 }],
    ["negative threshold", { name: "Doliprane", threshold: -1 }],
  ])(
    "should return 400 for invalid product payload: %s",
    async (_caseName, payload) => {
      const response = await request(app)
        .post("/medicines/products")
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    },
  );
});

describe("GET /medicines/products", () => {
  it("should return all created medicine products", async () => {
    await request(app).post("/medicines/products").send({
      name: "Doliprane",
      threshold: 10,
    });

    await request(app).post("/medicines/products").send({
      name: "Ibuprofene",
      threshold: 5,
    });

    const response = await request(app).get("/medicines/products");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "doliprane",
          threshold: 10,
        }),
        expect.objectContaining({
          name: "ibuprofene",
          threshold: 5,
        }),
      ]),
    );
  });
});

describe("POST /medicines/products/:medicineProductId/batches", () => {
  it("should create a batch for an existing medicine product", async () => {
    const productResponse = await request(app)
      .post("/medicines/products")
      .send({
        name: "Doliprane",
        threshold: 10,
      });

    const productId = productResponse.body.id;

    const response = await request(app)
      .post(`/medicines/products/${productId}/batches`)
      .send({
        quantity: 50,
        expirationDate: "2026-06-30",
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      medicineProductId: productId,
      quantity: 50,
      expirationDate: "2026-06-30T00:00:00.000Z",
    });
    expect(response.body).toHaveProperty("id");
  });

  it("should return 404 if medicine product does not exist", async () => {
    const response = await request(app)
      .post("/medicines/products/fake-product-id/batches")
      .send({
        quantity: 50,
        expirationDate: "2026-06-30",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it.each([
    ["empty payload", {}],
    ["negative quantity", { quantity: -1, expirationDate: "2026-06-30" }],
    [
      "invalid expiration date",
      { quantity: 10, expirationDate: "invalid-date" },
    ],
  ])(
    "should return 400 for invalid batch payload: %s",
    async (_caseName, payload) => {
      const productResponse = await request(app)
        .post("/medicines/products")
        .send({
          name: "Doliprane",
          threshold: 10,
        });

      const productId = productResponse.body.id;

      const response = await request(app)
        .post(`/medicines/products/${productId}/batches`)
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    },
  );
});

describe("GET /medicines/inventory", () => {
  it("should return inventory grouped by medicine product with total quantity", async () => {
    const productResponse = await request(app)
      .post("/medicines/products")
      .send({
        name: "Doliprane",
        threshold: 20,
      });

    const productId = productResponse.body.id;

    await request(app).post(`/medicines/products/${productId}/batches`).send({
      quantity: 10,
      expirationDate: "2026-06-30",
    });

    await request(app).post(`/medicines/products/${productId}/batches`).send({
      quantity: 15,
      expirationDate: "2026-07-30",
    });

    const response = await request(app).get("/medicines/inventory");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);

    expect(response.body[0]).toMatchObject({
      id: productId,
      name: "doliprane",
      threshold: 20,
      totalQuantity: 25,
    });

    expect(response.body[0].batches).toHaveLength(2);
  });
});
