import bcrypt from "bcryptjs";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

const createSuperAdmin = async () => {
  const passwordHash = await bcrypt.hash("password123", 10);

  return prisma.user.create({
    data: {
      email: "admin@example.com",
      passwordHash,
      role: "SUPER_ADMIN",
      pharmacyId: null,
    },
  });
};

describe("POST /auth/login", () => {
  it("should login with valid credentials and return a token", async () => {
    await createSuperAdmin();

    const response = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    expect(response.body.user).toMatchObject({
      email: "admin@example.com",
      role: "SUPER_ADMIN",
      pharmacyId: null,
    });

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user).not.toHaveProperty("passwordHash");
  });

  it("should normalize email before login", async () => {
    await createSuperAdmin();
    const response = await request(app).post("/auth/login").send({
      email: "  ADMIN@EXAMPLE.COM  ",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 401 if email does not exist", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "unknown@example.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 401 if password is invalid", async () => {
    await createSuperAdmin();

    const response = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it.each([
    ["empty payload", {}],
    ["invalid email", { email: "not-an-email", password: "password123" }],
    ["missing password", { email: "admin@example.com" }],
  ])(
    "should return 400 for invalid login payload: %s",
    async (_case, payload) => {
      const response = await request(app).post("/auth/login").send(payload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    },
  );
});

describe("GET /auth/me", () => {
  it("should return authenticated user with a valid token", async () => {
    await createSuperAdmin();

    const loginResponse = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      email: "admin@example.com",
      role: "SUPER_ADMIN",
      pharmacyId: null,
    });

    expect(response.body).toHaveProperty("id");
    expect(response.body).not.toHaveProperty("passwordHash");
  });

  it("should return 401 without token", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 401 with invalid token", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
});
