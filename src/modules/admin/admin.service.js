import AdminRepository from "./admin.repository.js";
import AppError from "../../shared/utils/AppError.js";
import logger from "../../shared/utils/logger.js";

class AdminService {
  static async getDashboardAnalytics(requestMeta = {}) {
    logger.info("Admin dashboard analytics requested", {
      userId: requestMeta.userId,
      ip: requestMeta.ip,
      userAgent: requestMeta.userAgent,
      timestamp: new Date(),
    });

    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const [
        totalUsers,
        totalVendors,
        totalOrders,
        totalRevenue,
        todaySales,
        pendingVerifications,
        activeDisputes,
      ] = await Promise.all([
        AdminRepository.getTotalUsers(),
        AdminRepository.getTotalVendors(),
        AdminRepository.getTotalOrders(),
        AdminRepository.getTotalRevenue(),
        AdminRepository.getTodaySales(startOfDay, endOfDay),
        AdminRepository.getPendingVerifications(),
      ]);

      const analytics = {
        totalUsers,
        totalVendors,
        totalRevenue:
          totalRevenue._sum.totalAmount?.toNumber?.() ??
          Number(totalRevenue._sum.totalAmount ?? 0),
        totalOrders,
        todaySales:
          todaySales._sum.totalAmount?.toNumber?.() ??
          Number(todaySales._sum.totalAmount ?? 0),
        pendingVerifications,
        activeDisputes,
      };

      logger.info("Admin dashboard analytics retrieved", {
        userId: requestMeta.userId,
        totalUsers,
        totalVendors,
        totalOrders,
        pendingVerifications,
        timestamp: new Date(),
      });

      return analytics;
    } catch (error) {
      logger.error("Failed to retrieve admin dashboard analytics", {
        userId: requestMeta.userId,
        error: error.message,
        stack: error.stack,
        ip: requestMeta.ip,
        userAgent: requestMeta.userAgent,
        timestamp: new Date(),
      });

      throw error;
    }
  }

  static async getPlatformReports(query, requestMeta = {}) {
    const { type = "sales", startDate, endDate, period = "monthly" } = query;

    logger.info("Admin platform report requested", {
      userId: requestMeta.userId,
      reportType: type,
      period,
      startDate,
      endDate,
      timestamp: new Date(),
    });

    try {
      if (!startDate || !endDate) {
        throw new AppError("startDate and endDate are required", 400);
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (Number.isNaN(start.getTime())) {
        throw new AppError("Invalid startDate", 400);
      }

      if (Number.isNaN(end.getTime())) {
        throw new AppError("Invalid endDate", 400);
      }

      if (start > end) {
        throw new AppError("startDate cannot be greater than endDate", 400);
      }

      switch (type.toLowerCase()) {
        case "sales":
          return await this.getSalesReport(start, end, period, requestMeta);

        default:
          throw new AppError(`Unsupported report type: ${type}`, 400);
      }
    } catch (error) {
      if (!(error instanceof AppError)) {
        logger.error("Failed to generate platform report", {
          userId: requestMeta.userId,
          reportType: type,
          period,
          startDate,
          endDate,
          error: error.message,
          stack: error.stack,
          ip: requestMeta.ip,
          userAgent: requestMeta.userAgent,
          timestamp: new Date(),
        });
      }

      throw error;
    }
  }

  static async getSalesReport(startDate, endDate, period, requestMeta = {}) {
    try {
      const orders = await AdminRepository.getSalesReport(startDate, endDate);

      const report = this.groupSalesByPeriod(orders, period);

      logger.info("Sales report generated", {
        userId: requestMeta.userId,
        period,
        startDate,
        endDate,
        orderCount: orders.length,
        timestamp: new Date(),
      });

      return {
        type: "sales",
        period,
        startDate,
        endDate,
        data: report,
      };
    } catch (error) {
      logger.error("Failed to generate sales report", {
        userId: requestMeta.userId,
        period,
        startDate,
        endDate,
        error: error.message,
        stack: error.stack,
        ip: requestMeta.ip,
        userAgent: requestMeta.userAgent,
        timestamp: new Date(),
      });

      throw error;
    }
  }

  // Group sales into daily / weekly / monthly periods.
  static groupSalesByPeriod(orders, period) {
    const grouped = {};

    for (const order of orders) {
      const date = new Date(order.createdAt);

      let key;

      if (period === "daily") {
        key = date.toISOString().split("T")[0];
      } else if (period === "monthly") {
        key = date.toISOString().slice(0, 7);
      } else if (period === "yearly") {
        key = date.getUTCFullYear().toString();
      } else {
        throw new AppError("period must be daily, monthly, or yearly", 400);
      }

      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          orders: 0,
          revenue: 0,
        };
      }

      grouped[key].orders += 1;
      grouped[key].revenue += Number(order.totalAmount);
    }

    return Object.values(grouped);
  }

  static async getUsers(query, requestMeta = {}) {
    try {
      const users = await AdminRepository.findUsers(query);

      logger.info("Admin retrieved users", {
        userId: requestMeta.userId,
        page: query.page,
        limit: query.limit,
        timestamp: new Date(),
      });

      return users;
    } catch (error) {
      logger.error("Failed to retrieve users", {
        userId: requestMeta.userId,
        error: error.message,
        stack: error.stack,
        timestamp: new Date(),
      });

      throw error;
    }
  }

  static async getAuditLogs(query, requestMeta = {}) {
    let { page = 1, limit = 50, action, resource, startDate, endDate } = query;

    page = Number(page);
    limit = Number(limit);

    logger.info("Admin audit logs requested", {
      userId: requestMeta.userId,
      page,
      limit,
      action,
      resource,
      startDate,
      endDate,
      timestamp: new Date(),
    });

    try {
      if (page < 1) {
        throw new AppError("Page must be greater than 0", 400);
      }

      if (limit < 1 || limit > 100) {
        throw new AppError("Limit must be between 1 and 100", 400);
      }

      const validActions = [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "APPROVE",
        "REJECT",
        "SUSPEND",
        "BAN",
        "VERIFY",
      ];

      if (action) {
        action = action.toUpperCase();

        if (!validActions.includes(action)) {
          logger.warn("Invalid audit action requested", {
            userId: requestMeta.userId,
            action,
            timestamp: new Date(),
          });

          throw new AppError(`Invalid audit action: ${action}`, 400);
        }
      }

      const logs = await AdminRepository.findAuditLogs({
        page,
        limit,
        action,
        resource,
        startDate,
        endDate,
      });

      logger.info("Admin audit logs retrieved", {
        userId: requestMeta.userId,
        page,
        limit,
        action,
        resource,
        timestamp: new Date(),
      });

      return logs;
    } catch (error) {
      if (!(error instanceof AppError)) {
        logger.error("Failed to retrieve audit logs", {
          userId: requestMeta.userId,
          error: error.message,
          stack: error.stack,
          timestamp: new Date(),
        });
      }

      throw error;
    }
  }
}

export default AdminService;
