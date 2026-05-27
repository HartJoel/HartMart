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
}

export default AuthService;
