import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import { sendErrorResponse } from "../utils/error-response.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      logger.warn("Missing access token", {
        ip: req.ip,
        route: req.originalUrl,
      });
      return sendErrorResponse(res, 401, "Authentication is required. Please sign in.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendErrorResponse(res, 401, "Your access token has expired. Refresh it or sign in again.", "TOKEN_EXPIRED");
    }

    if (["JsonWebTokenError", "NotBeforeError"].includes(error.name)) {
      return sendErrorResponse(res, 401, "The access token is invalid. Please sign in again.");
    }

    next(error);
  }
};
