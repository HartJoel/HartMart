import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      logger.warn("Missing access token", {
        ip: req.ip,
        route: req.originalUrl,
      });
      return res.status(401).json({
        success: false,
        error: "No access token provided. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Access token expired. Please refresh.",
      });
    }

    return res.status(401).json({
      success: false,
      error: "Invalid access token",
    });
  }
};
