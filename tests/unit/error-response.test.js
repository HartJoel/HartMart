import { describe, expect, it, vi } from "vitest";
import { getErrorCode, sendErrorResponse } from "../../src/shared/utils/error-response.js";
import { validateRequest } from "../../src/shared/middleware/validate.request.js";
import { z } from "zod";

describe("API error responses", () => {
  it("maps documented HTTP statuses to their API error codes", () => {
    const statuses = [
      [400, "BAD_REQUEST"],
      [401, "AUTHENTICATION_ERROR"],
      [403, "AUTHORIZATION_ERROR"],
      [404, "NOT_FOUND"],
      [409, "CONFLICT_ERROR"],
      [422, "UNPROCESSABLE_ENTITY"],
      [429, "RATE_LIMIT_EXCEEDED"],
      [500, "INTERNAL_SERVER_ERROR"],
      [502, "BAD_GATEWAY"],
      [503, "SERVICE_UNAVAILABLE"],
    ];
    expect(statuses.map(([status]) => getErrorCode(status))).toEqual(
      statuses.map(([, code]) => code),
    );
  });

  it("keeps validation failures at 400 and identifies them distinctly", () => {
    const req = { body: { email: "not-an-email" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();
    const middleware = validateRequest(z.object({ email: z.string().email() }));

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      code: "VALIDATION_ERROR",
      message: expect.stringContaining("email"),
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it("preserves the legacy error string while adding a stable code and message", () => {
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    sendErrorResponse(res, 401, "Please sign in.");

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status: "fail",
      code: "AUTHENTICATION_ERROR",
      message: "Please sign in.",
      error: "Please sign in.",
    });
  });
});
