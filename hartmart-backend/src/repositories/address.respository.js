import { prisma } from "../config/db.js";

class AddressRepository {
  static async create(data) {
    return prisma.address.create({
      data,
    });
  }

  static async findByUserId(userId) {
    return prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async findById(id) {
    return prisma.address.findUnique({
      where: {
        id,
      },
    });
  }

  static async update(id, data) {
    return prisma.address.update({
      where: {
        id,
      },
      data,
    });
  }

  static async delete(id) {
    return prisma.address.delete({
      where: {
        id,
      },
    });
  }

  static async countByUserId(userId) {
    return prisma.address.count({
      where: {
        userId,
      },
    });
  }

  static async clearDefaultAddresses(userId) {
    return prisma.address.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }
}

export default AddressRepository;
