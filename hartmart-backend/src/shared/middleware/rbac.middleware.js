import { sendErrorResponse } from "../utils/error-response.js";

export const requireRole = (requiredRole) => (req, res, next) => {
  if (!req.user) {
    return sendErrorResponse(res, 401, "Authentication is required. Please sign in.");
  }

  if (req.user.role !== requiredRole) {
    return sendErrorResponse(res, 403, "You do not have permission to perform this action.");
  }

  next();
};

export const requireRoles = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return sendErrorResponse(res, 401, "Authentication is required. Please sign in.");
  }

  if (!allowedRoles.includes(req.user.role)) {
    return sendErrorResponse(res, 403, "You do not have permission to perform this action.");
  }

  next();
};
