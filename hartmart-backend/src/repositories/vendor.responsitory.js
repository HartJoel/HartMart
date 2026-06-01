import { prisma } from "../config/db.js";

class VendorRepository {
  static async findUserId(userId) {
    return prisma.vendor.findUnique({
      where: {
        userId,
      },
    });
  }

  static async findByStoreSlug(storeSlug) {
    return prisma.vendor.findUnique({
      where: {
        storeSlug,
      },
    });
  }

  static async create(data) {
    return prisma.vendor.create({
      data,
    });
  }
}

export default VendorRepository;
