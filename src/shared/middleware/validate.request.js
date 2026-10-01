import { sendErrorResponse } from "../utils/error-response.js";

export const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});

    if (!result.success) {
      const message = result.error.issues
        .map(({ path, message: issueMessage }) =>
          (path.length ? path.join(".") : "request") + ": " + issueMessage,
        )
        .join(", ");

      return sendErrorResponse(res, 400, message, "VALIDATION_ERROR");
    }

    if (source === "body") {
      req.body = result.data;
    } else if (source === "params") {
      req.params = result.data;
    } else {
      req.validatedQuery = result.data;
    }
    next();
  };
};
