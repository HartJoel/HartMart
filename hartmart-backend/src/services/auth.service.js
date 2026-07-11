import { prisma } from "../config/db.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import AuthRepository from "../repositories/auth.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generate.token.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";

class AuthService {
  // REGISTER USER
  static async register(data) {
    const { name, email, password } = data;
    logger.info("Registration attempt", { email });

    try {
      const userExists = await AuthRepository.findUserByEmail(email);

      if (userExists) {
        logger.warn("Registration failed - email already exists", {
          email,
        });
        throw new AppError("User with this email already exists", 409);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      // Generate email verification token (valid for 24 hours)
      const emailVerificationToken = crypto.randomBytes(32).toString("hex");
      const emailVerificationTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      );

      const user = await AuthRepository.createUser({
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        emailVerificationToken,
        emailVerificationTokenExpires,
      });

      logger.info("User registered successfully", {
        userId: user.id,
        email,
      });

      return { user };
    } catch (error) {
      logger.error("Registration error", {
        email,
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }

  static async verifyEmail(token) {
    try {
      const user = await AuthRepository.findEmailToken(token);

      if (!user) {
        throw new AppError("Invalid or expired verification token", 404);
      }

      const updatedUser = await AuthRepository.verifyEmail(user);

      return {
        success: true,
        message: "Email verified successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          emailVerified: updatedUser.emailVerified,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(data) {
    try {
      const { email, password } = data;

      const user = await AuthRepository.findUserByEmail(email);

      if (!user) {
        throw new AppError("User doesn't exist", 404);
      }

      if (!user.emailVerified) {
        throw new AppError("Email not verified", 404);
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 404);
      }

      // Generate tokens
      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id);

      AuthRepository.createRefreshToken(refreshToken, user);

      delete user.password;

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  static async forgotPassword(email) {
    try {
      const user = await AuthRepository.findUserByEmail(email);

      if (!user) {
        return {
          success: true,
          message: "If an account exists, password reset email will be sent",
        };
      }

      // Generate password reset token (valid for 1 hour)
      const passwordResetToken = crypto.randomBytes(32).toString("hex");
      const passwordResetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

      AuthRepository.forgetPassword(
        user,
        passwordResetToken,
        passwordResetTokenExpires,
      );

      return {
        success: true,
        message: "If an account exists, password reset email will be sent",
        passwordResetToken,
      };
    } catch (error) {
      throw error;
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      const user = await AuthRepository.findPasswordResetToken(token);

      if (!user) {
        throw new AppError("Invalid or expired reset token", 404);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      AuthRepository.updatePassword(user, hashedPassword);

      return {
        success: true,
        message: "Password reset successfully. Please login with new password.",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
