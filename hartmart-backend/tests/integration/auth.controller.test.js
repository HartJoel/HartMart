import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import bcrypt from "bcryptjs";
import { prisma } from "../../src/config/db.js";
import authRoutes from "../../src/modules/auth/auth.routes.js";
import errorMiddleware from "../../src/shared/middleware/error.middleware.js";
import { makeRegistrationPayload } from "../helpers/auth.factory.js";
import { cleanupAuthTestData } from "../helpers/database.js";

const hasTestDatabase = Boolean(process.env.TEST_DATABASE_URL);
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/v1/auth", authRoutes);
app.use(errorMiddleware);

describe.skipIf(!hasTestDatabase)("Auth register/login HTTP integration", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterEach(async () => {
    await cleanupAuthTestData(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("registers a new user through the route, validator, controller, service and database", async () => {
    const payload = makeRegistrationPayload();

    const response = await request(app)
      .post("/v1/auth/register")
      .set("User-Agent", "supertest-auth")
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        user: {
          name: payload.name,
          email: payload.email,
          emailVerified: false,
        },
      },
    });

    const storedUser = await prisma.user.findUnique({ where: { email: payload.email } });
    expect(storedUser).not.toBeNull();
    expect(storedUser.password).not.toBe(payload.password);
    await expect(bcrypt.compare(payload.password, storedUser.password)).resolves.toBe(true);
  });

  it("returns a conflict when the email is already registered", async () => {
    const payload = makeRegistrationPayload();
    await request(app).post("/v1/auth/register").send(payload).expect(201);

    const response = await request(app).post("/v1/auth/register").send(payload);

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      success: false,
      message: "User with this email already exists",
    });
  });

  it("rejects invalid registration input before reaching the service", async () => {
    const response = await request(app)
      .post("/v1/auth/register")
      .send({ name: "No", email: "not-an-email", password: "123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeTruthy();
  });

  it("logs in a verified user and sets secure httpOnly auth cookies", async () => {
    const payload = makeRegistrationPayload();
    const passwordHash = await bcrypt.hash(payload.password, 4);
    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: passwordHash,
        emailVerified: true,
      },
    });

    const response = await request(app)
      .post("/v1/auth/login")
      .set("User-Agent", "supertest-auth")
      .send({ email: payload.email, password: payload.password });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: { user: { id: user.id, email: user.email } },
    });
    expect(response.body.data.accessToken).toEqual(expect.any(String));
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("accessToken="),
        expect.stringContaining("refreshToken="),
      ]),
    );
    expect(response.headers["set-cookie"].every((cookie) => /httponly/i.test(cookie))).toBe(true);

    const refreshTokenCount = await prisma.refreshToken.count({ where: { userId: user.id } });
    expect(refreshTokenCount).toBe(1);
  });

  it("rejects login for an unverified user", async () => {
    const payload = makeRegistrationPayload();
    await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: await bcrypt.hash(payload.password, 4),
        emailVerified: false,
      },
    });

    const response = await request(app)
      .post("/v1/auth/login")
      .send({ email: payload.email, password: payload.password });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Email not verified");
  });

  it("rejects login for an incorrect password", async () => {
    const payload = makeRegistrationPayload();
    await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: await bcrypt.hash(payload.password, 4),
        emailVerified: true,
      },
    });

    const response = await request(app)
      .post("/v1/auth/login")
      .send({ email: payload.email, password: "Wrong-Password-42" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Invalid email or password");
  });
});
