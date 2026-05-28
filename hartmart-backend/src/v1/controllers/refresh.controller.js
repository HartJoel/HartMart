// controllers/refreshController.js
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db.js";
import { generateAccessToken } from "../../utils/generate.token.js";

export const refreshToken = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (!refreshTokenCookie) {
      return res.status(401).json({
        success: false,
        error: "No refresh token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenCookie },
    });

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        error: "Refresh token not found in database",
      });
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({
        where: { token: refreshTokenCookie },
      });

      return res.status(401).json({
        success: false,
        error: "Refresh token has expired",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      await prisma.refreshToken.delete({
        where: { token: refreshTokenCookie },
      });

      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    const newAccessToken = generateAccessToken(user.id, user.role);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error during token refresh",
    });
  }
};
