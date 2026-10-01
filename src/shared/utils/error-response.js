const ERROR_CODES = {
  400: "BAD_REQUEST",
  401: "AUTHENTICATION_ERROR",
  403: "AUTHORIZATION_ERROR",
  404: "NOT_FOUND",
  409: "CONFLICT_ERROR",
  422: "UNPROCESSABLE_ENTITY",
  429: "RATE_LIMIT_EXCEEDED",
  500: "INTERNAL_SERVER_ERROR",
  502: "BAD_GATEWAY",
  503: "SERVICE_UNAVAILABLE",
};

export const getErrorCode = (statusCode, code) =>
  code || ERROR_CODES[statusCode] || "INTERNAL_SERVER_ERROR";

export const errorResponse = (statusCode, message, code) => ({
  success: false,
  status: statusCode < 500 ? "fail" : "error",
  code: getErrorCode(statusCode, code),
  message,
  // Keep this alias while existing clients migrate to the standard message field.
  error: message,
});

export const sendErrorResponse = (res, statusCode, message, code) =>
  res.status(statusCode).json(errorResponse(statusCode, message, code));
