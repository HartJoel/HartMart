import { prisma } from "../config/db.js";

class VendorRepository {
  static async findUserId(userId) {
    return prisma.vendor.findUnique({
      where: {
        userId,
      },
    });
  }

  static async findById(vendorId) {
    return prisma.vendor.findUnique({
      where: { id: vendorId },
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

  static async updateVendor(vendorId, data) {
    return prisma.vendor.update({
      where: {
        id: vendorId,
      },
      data,
    });
  }

  static async getAllVendors() {
    return prisma.vendor.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  static async verifyVendor(vendorId) {
    return prisma.vendor.update({
      where: {
        id: vendorId,
      },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
      },
    });
  }

  static async rejectVendor(vendorId, reason) {
    return prisma.vendor.update({
      where: {
        id: vendorId,
      },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
    });
  }

  static suspendVendor(vendorId) {
    return prisma.vendor.update({
      where: {
        id: vendorId,
      },
      data: {
        status: "SUSPENDED",
      },
    });
  }

  static getVendorMetrics(vendorId) {
    return prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
      select: {
        averageRating: true,
        totalReviews: true,
        status: true,
        verifiedAt: true,
        createdAt: true,
      },
    });
  }

  static getTopVendors() {
    return prisma.vendor.findMany({
      orderBy: {
        averageRating: "desc",
      },
      take: 10,
    });
  }

  static getTopVendors() {
    return prisma.vendor.findMany({
      orderBy: {
        averageRating: "desc",
      },
      take: 10,
    });
  }
}

export default VendorRepository;
