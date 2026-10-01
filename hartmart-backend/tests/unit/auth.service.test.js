import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { repository, logger, eventService } = vi.hoisted(() => ({
  repository: {
    findUserByEmail: vi.fn(),
    createUser: vi.fn(),
    createRefreshToken: vi.fn(),
  },
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  eventService: { emit: vi.fn() },
}));

vi.mock("../../src/modules/auth/auth.repository.js", () => ({
  default: repository,
}));
vi.mock("../../src/shared/utils/logger.js", () => ({ default: logger }));
vi.mock("../../src/events/eventService.js", () => ({ default: eventService }));

const { default: AuthService } = await import(
  "../../src/modules/auth/auth.service.js"
);

describe("AuthService.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a verified user with a hashed password and no verification token", async () => {
    const input = {
      name: "Test Customer",
      email: "customer@example.test",
      password: "Correct-Horse-42",
    };
    repository.findUserByEmail.mockResolvedValue(null);
    repository.createUser.mockImplementation(async (data) => ({
      id: "user_test_1",
      ...data,
    }));

    const { user } = await AuthService.register(input);

    expect(user.id).toBe("user_test_1");
    expect(user.emailVerified).toBe(true);
    expect(user).not.toHaveProperty("emailVerificationToken");
    expect(user).not.toHaveProperty("emailVerificationTokenExpires");
    expect(user.password).not.toBe(input.password);
    await expect(bcrypt.compare(input.password, user.password)).resolves.toBe(true);
    expect(repository.createUser).toHaveBeenCalledOnce();
    expect(eventService.emit).toHaveBeenCalledWith(
      "user.registered",
      expect.objectContaining({ user, ipAddress: undefined }),
    );
    expect(eventService.emit).toHaveBeenCalledOnce();
  });

  it("rejects a duplicate email without creating another user", async () => {
    repository.findUserByEmail.mockResolvedValue({ id: "existing_user" });

    await expect(
      AuthService.register({ email: "used@example.test", password: "secret" }),
    ).rejects.toMatchObject({
      message: "User with this email already exists",
      statusCode: 409,
    });
    expect(repository.createUser).not.toHaveBeenCalled();
  });
});

describe("AuthService.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a user and signed tokens for a verified user with a valid password", async () => {
    const password = "Correct-Horse-42";
    const passwordHash = await bcrypt.hash(password, 4);
    const dbUser = {
      id: "user_login_1",
      name: "Test Customer",
      email: "customer@example.test",
      password: passwordHash,
      role: "CUSTOMER",
      emailVerified: true,
    };
    repository.findUserByEmail.mockResolvedValue(dbUser);

    const result = await AuthService.login(
      { email: dbUser.email, password },
      { ip: "127.0.0.1", userAgent: "unit-test" },
    );

    expect(result.user).toMatchObject({ id: dbUser.id, email: dbUser.email });
    expect(result.user).not.toHaveProperty("password");
    expect(jwt.verify(result.accessToken, process.env.JWT_SECRET)).toMatchObject({
      id: dbUser.id,
      role: dbUser.role,
    });
    expect(jwt.verify(result.refreshToken, process.env.JWT_REFRESH_SECRET)).toMatchObject({
      id: dbUser.id,
    });
    expect(repository.createRefreshToken).toHaveBeenCalledWith(
      result.refreshToken,
      expect.objectContaining({ id: dbUser.id, email: dbUser.email }),
    );
    expect(eventService.emit).toHaveBeenCalledWith("user.logged.in", {
      user: dbUser.id,
      ipAddress: "127.0.0.1",
      userAgent: "unit-test",
    });
  });

  it("rejects an unknown email", async () => {
    repository.findUserByEmail.mockResolvedValue(null);

    await expect(
      AuthService.login({ email: "missing@example.test", password: "secret" }),
    ).rejects.toMatchObject({ message: "User doesn't exist", statusCode: 404 });
    expect(repository.createRefreshToken).not.toHaveBeenCalled();
  });

  it("allows an existing unverified user to log in with a valid password", async () => {
    const password = "Correct-Horse-42";
    repository.findUserByEmail.mockResolvedValue({
      id: "unverified_user",
      email: "unverified@example.test",
      password: await bcrypt.hash(password, 4),
      role: "CUSTOMER",
      emailVerified: false,
    });

    const result = await AuthService.login({ email: "unverified@example.test", password });

    expect(result.user.emailVerified).toBe(false);
    expect(jwt.verify(result.accessToken, process.env.JWT_SECRET)).toMatchObject({
      id: "unverified_user",
      role: "CUSTOMER",
    });
    expect(repository.createRefreshToken).toHaveBeenCalledOnce();
  });

  it("rejects an incorrect password", async () => {
    repository.findUserByEmail.mockResolvedValue({
      id: "verified_user",
      email: "verified@example.test",
      password: await bcrypt.hash("the-real-password", 4),
      emailVerified: true,
    });

    await expect(
      AuthService.login({ email: "verified@example.test", password: "wrong-password" }),
    ).rejects.toMatchObject({ message: "Invalid email or password", statusCode: 404 });
    expect(repository.createRefreshToken).not.toHaveBeenCalled();
  });
});
