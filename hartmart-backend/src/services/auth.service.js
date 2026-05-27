import { prisma } from "../config/db.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import AuthRepository from "../repositories/auth.repository.js";

class AuthService {
  // REGISTER USER
  static async register(data) {
    try {
      const { name, email, password } = data;

      const userExists = await AuthRepository.findUserByEmail(email);

      if (userExists) {
        throw new Error("User with this email already exists");
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

      return { user };
    } catch (error) {
      throw error;
    }
  }

  static async verifyEmail(token) {
    try {
      const user = await AuthRepository.findEmailToken(token);

      if (!user) {
        throw new Error("Invalid or expired verification token");
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
        throw new Error("User doesn't exist");
      }

      if (!user.emailVerified) {
        throw new Error("Email not verified");
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      delete user.password;

      return {
        user,
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

      AuthRepository.forgetPassword(user, passwordResetToken, passwordResetTokenExpires)

      return {
        success: true,
        message: "If an account exists, password reset email will be sent",
        passwordResetToken,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
