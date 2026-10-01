import { errorResponse } from "../utils/error-response.js";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = Number.isInteger(err.statusCode) ? err.statusCode : err.status;
  if (!Number.isInteger(statusCode) || statusCode < 400 || statusCode > 599) {
    statusCode = 500;
  }
  let code = err.code;
  let message = err.message;

  if (err.type === "entity.parse.failed" || (err.name === "SyntaxError" && statusCode === 400)) {
    statusCode = 400;
    code = "BAD_REQUEST";
    message = "The request body contains invalid JSON.";
  } else if (err.code === "P2002") {
    statusCode = 409;
    code = "CONFLICT_ERROR";
    message = "A record with this value already exists.";
  } else if (err.code === "P2025") {
    statusCode = 404;
    code = "NOT_FOUND";
    message = "The requested record was not found.";
  } else if (err.code === "P2003") {
    statusCode = 400;
    code = "BAD_REQUEST";
    message = "The request references a record that does not exist.";
  }

  if (statusCode >= 500 && err.isOperational !== true) {
    message = "An unexpected server error occurred.";
  }

  res.status(statusCode).json(errorResponse(
    statusCode,
    message || "An unexpected server error occurred.",
    code,
  ));
};

export default errorMiddleware;
