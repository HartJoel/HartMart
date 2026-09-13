import { prisma } from "../config/db.js";
import QueryBuilder from "../utils/queryBuilder.js";

class AdminRepository {
  static async getTotalUsers() {
    return prisma.user.count({
      where: {
        deletedAt: null,
      },
    });
  }

  static async getTotalVendors() {
    return prisma.vendor.count({
      where: {
        deletedAt: null,
      },
    });
  }

  static async getTotalOrders() {
    return prisma.order.count();
  }

  static async getTotalRevenue() {
    return prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: {
          in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"],
        },
      },
    });
  }

  static async getTodaySales(startOfDay, endOfDay) {
    return prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
        status: {
          in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"],
        },
      },
    });
  }

  static async getPendingVerifications() {
    return prisma.vendor.count({
      where: {
        status: "PENDING_VERIFICATION",
        deletedAt: null,
      },
    });
  }

  //REPORT
  static async getSalesReport(startDate, endDate) {
    return prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"],
        },
      },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  static async findUsers(query) {
    return new QueryBuilder(prisma.user, query)
      .search(["name", "email"])
      .filter()
      .sort()
      .paginate()
      .exec();
  }

  //audit logs
  static async createAuditLog(data) {
    return prisma.auditLog.create({
      data,
    });
  }

  static async findAuditLogs(query) {
    return new QueryBuilder(prisma.auditLog, query)
      .filter()
      .sort()
      .paginate()
      .exec();
  }
}

export default AdminRepository;
