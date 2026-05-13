import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";
import {
  getSuperAdminToken,
  setupTestAccount,
  getPharmacyAdminLoginData,
  getUserToken,
} from "./helpers/database";

describe("GET /admin/pharmacies", () => {
  it("should return a list of all pharmacies", async () => {
    await setupTestAccount(true, true, false);

    const token = await getSuperAdminToken();
    const response = await request(app)
      .get("/admin/pharmacies")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("email");
  });

  it("should return 401 for unauthorized requests if no token is provided", async () => {
    await setupTestAccount(true, true, false);

    const response = await request(app)
      .get("/admin/pharmacies")
      .set("Authorization", "");

    expect(response.status).toBe(401);
  });

  it("should return 403 for non-super-admin users", async () => {
    await setupTestAccount(true, true, true);
    const pharmacyAdminData = getPharmacyAdminLoginData("Pharma1");
    const token = await getUserToken(pharmacyAdminData);

    const response = await request(app)
      .get("/admin/pharmacies")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});

describe("POST /admin/pharmacies", () => {
  it("should create a new pharmacy", async () => {
    await setupTestAccount(true, false, false);

    const token = await getSuperAdminToken();
    const response = await request(app)
      .post("/admin/pharmacies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Pharma1",
        email: "pharma1@pharma-stock.test",
        address: "1 Pharma1 street",
        city: "Seynod",
        zipCode: "74000",
        country: "France",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
  });

  it("should not create a new pharmacy with invalid data", async () => {
    await setupTestAccount(true, false, false);

    const token = await getSuperAdminToken();
    const response = await request(app)
      .post("/admin/pharmacies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "pharma1@pharma-stock.test",
        address: "1 Pharma1 street",
        city: "Seynod",
        zipCode: "74000",
        country: "France",
      });

    expect(response.status).toBe(400);
  });

  it("should not create a new pharmacy with existing email", async () => {
    await setupTestAccount(true, true, false);

    const token = await getSuperAdminToken();
    const response = await request(app)
      .post("/admin/pharmacies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Pharma1",
        email: "pharma1@pharma-stock.test",
        address: "1 Pharma1 street",
        city: "Seynod",
        zipCode: "74000",
        country: "France",
      });

    expect(response.status).toBe(409);
  });
});

describe("POST /admin/pharmacies/:pharmacyId/admins", () => {
  it("should create a new pharmacy admin", async () => {
    const { pharmacy } = await setupTestAccount(true, true, false);
    expect(pharmacy).not.toBeNull();
    if (!pharmacy) {
      throw new Error("Expected pharmacy to be created");
    }

    const token = await getSuperAdminToken();
    const response = await request(app)
      .post(`/admin/pharmacies/${pharmacy.id}/admins`)
      .set("Authorization", `Bearer ${token}`)
      .send(getPharmacyAdminLoginData("Pharma1"));

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("pharmacyId");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("role", "PHARMACY_ADMIN");
    expect(response.body).not.toHaveProperty("passwordHash");
  });

  it("should not create a new pharmacy admin with invalid pharmacy ID", async () => {
    await setupTestAccount(true, true, false);

    const token = await getSuperAdminToken();
    const response = await request(app)
      .post(`/admin/pharmacies/bad-id/admins`)
      .set("Authorization", `Bearer ${token}`)
      .send(getPharmacyAdminLoginData("Pharma1"));

    expect(response.status).toBe(404);
  });

  it("should not create a new pharmacy admin with already existing email", async () => {
    const { pharmacy } = await setupTestAccount(true, true, true);
    expect(pharmacy).not.toBeNull();
    if (!pharmacy) {
      throw new Error("Expected pharmacy to be created");
    }

    const token = await getSuperAdminToken();
    const response = await request(app)
      .post(`/admin/pharmacies/${pharmacy.id}/admins`)
      .set("Authorization", `Bearer ${token}`)
      .send(getPharmacyAdminLoginData("Pharma1"));

    expect(response.status).toBe(409);
  });

  it("should not create a new pharmacy admin with invalid payload", async () => {
    const { pharmacy } = await setupTestAccount(true, true, false);
    expect(pharmacy).not.toBeNull();
    if (!pharmacy) {
      throw new Error("Expected pharmacy to be created");
    }

    const token = await getSuperAdminToken();
    const response = await request(app)
      .post(`/admin/pharmacies/${pharmacy.id}/admins`)
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "not-an-email", password: "short" });

    expect(response.status).toBe(400);
  });
});
