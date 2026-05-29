import { prisma } from "../config/db.js";

class AddressRepository {
  static async create(data) {
    return prisma.address.create({
      data,
    });
  }

  static async countByUserId(userId) {
    return prisma.address.count({
      where: {
        userId,
      },
    });
  }
}

export default AddressRepository;
