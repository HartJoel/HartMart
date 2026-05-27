import { prisma } from "../config/db.js";

class AuthRepository {
  static async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async createUser(data) {
    return prisma.user.create({
      data,
    });
  }
}

export default AuthRepository;
