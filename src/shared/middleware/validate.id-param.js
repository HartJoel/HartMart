import { z } from "zod";
import { validateRequest } from "./validate.request.js";

export const validateIdParam = (paramName) =>
  validateRequest(
    z.object({
      [paramName]: z.string().trim().min(1, `${paramName} is required`).max(128),
    }),
    "params",
  );
