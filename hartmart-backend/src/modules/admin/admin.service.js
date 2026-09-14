import AdminRepository from "./admin.repository.js";
import AppError from "../../shared/utils/AppError.js";

class AdminService {
  static async getDashboardAnalytics() {
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

    return {
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
  }

  static async getPlatformReports(query) {
    const { type = "sales", startDate, endDate, period = "monthly" } = query;

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
        return this.getSalesReport(start, end, period);

      default:
        throw new AppError(`Unsupported report type: ${type}`, 400);
    }
  }

  static async getSalesReport(startDate, endDate, period) {
    const orders = await AdminRepository.getSalesReport(startDate, endDate);

    const report = this.groupSalesByPeriod(orders, period);

    return {
      type: "sales",
      period,
      startDate,
      endDate,
      data: report,
    };
  }

  //Group sales into daily / weekly / monthly periods.
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

  static async getUsers(query) {
    return AdminRepository.findUsers(query);
  }

  static async findAuditLogs({
  page = 1,
  limit = 50,
  action,
  resource,
  startDate,
  endDate,
}) {
  const where = {};

  if (action) {
    where.action = action;
  }

  if (resource) {
    where.resource = resource;
  }

  if (startDate || endDate) {
    where.createdAt = {};

    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }

    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  return new QueryBuilder(prisma.auditLog, {
    page,
    limit,
    ...where,
  })
    .sort()
    .paginate()
    .exec();
}


  static async getAuditLogs(query) {
  let {
    page = 1,
    limit = 50,
    action,
    resource,
    startDate,
    endDate,
  } = query;

  page = Number(page);
  limit = Number(limit);

  if (page < 1) {
    throw new AppError(
      "Page must be greater than 0",
      400
    );
  }

  if (limit < 1 || limit > 100) {
    throw new AppError(
      "Limit must be between 1 and 100",
      400
    );
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
      throw new AppError(
        `Invalid audit action: ${action}`,
        400
      );
    }
  }

  return AdminRepository.findAuditLogs({
    page,
    limit,
    action,
    resource,
    startDate,
    endDate,
  });
}
}

export default AdminService;
