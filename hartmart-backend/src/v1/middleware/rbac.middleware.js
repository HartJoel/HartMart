import jwt from "jsonwebtoken";

/**
 * Middleware to check if user has specific role
 *
 * Usage: router.delete('/admin/user', authMiddleware, requireRole('admin'), controller)
 */
export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "No user authenticated",
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required role: ${requiredRole}`,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has any of the provided roles
 *
 * Usage: router.delete('/admin/user', authMiddleware, requireRoles(['admin', 'moderator']), controller)
 */
export const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "No user authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};
