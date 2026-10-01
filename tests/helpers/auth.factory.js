import { randomUUID } from "node:crypto";

export const AUTH_TEST_EMAIL_PREFIX = "auth-vitest-";

export function makeRegistrationPayload(overrides = {}) {
  return {
    name: "Test Customer",
    email: `${AUTH_TEST_EMAIL_PREFIX}${randomUUID()}@example.test`,
    password: "Correct-Horse-42",
    ...overrides,
  };
}

export function makeRequestMeta(overrides = {}) {
  return {
    ip: "127.0.0.1",
    userAgent: "vitest-supertest",
    ...overrides,
  };
}
