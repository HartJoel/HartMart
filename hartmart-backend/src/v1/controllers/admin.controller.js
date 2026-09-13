import AdminService from "../../services/admin.service.js";
import ExportService from "../../services/export.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

class AdminController {
  static getDashboardAnalytics = asyncHandler(async (req, res) => {
    const analytics = await AdminService.getDashboardAnalytics();

    return res.status(200).json({
      success: true,
      message: "Admin dashboard analytics retrieved successfully",
      data: analytics,
    });
  });

  static getPlatformReports = asyncHandler(async (req, res) => {
    const report = await AdminService.getPlatformReports(req.query);
    return res.status(200).json({
      success: true,
      message: "Platform report retrieved successfully",
      data: report,
    });
  });

  static getUsers = asyncHandler(async (req, res) => {
    const users = await AdminService.getUsers(req.query);

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  });

  static getAuditLogs = asyncHandler(async (req, res) => {
    const logs = await AdminService.getAuditLogs(req.query);

    return res.status(200).json({
      success: true,
      message: "Audit logs retrieved successfully",
      data: logs,
    });
  });

  static exportData = asyncHandler(async (req, res) => {
    const { type, format = "csv", startDate, endDate } = req.query;

    const { csv, filename } = await ExportService.exportData({
      type,
      format,
      startDate,
      endDate,
    });

    res.setHeader("Content-Type", "text/csv");

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.status(200).send(csv);
  });
}

export default AdminController;
