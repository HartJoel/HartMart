import express from "express";
import { requireRole, requireRoles } from "../../shared/middleware/rbac.middleware.js";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import AdminController from "./admin.controller.js";
import { validateRequest } from "../../shared/middleware/validate.request.js";
import {
  adminExportQuerySchema,
  adminReportQuerySchema,
  auditLogQuerySchema,
  userListQuerySchema,
} from "../../shared/validators/list-query.validator.js";

const router = express.Router();

router.use(authMiddleware);
router.use(requireRoles("ADMIN"));

router.get("/dashboard", AdminController.getDashboardAnalytics);
router.get("/reports", validateRequest(adminReportQuerySchema, "query"), AdminController.getPlatformReports);
router.get("/users", validateRequest(userListQuerySchema, "query"), AdminController.getUsers);
router.get("/logs", validateRequest(auditLogQuerySchema, "query"), AdminController.getAuditLogs);
router.get("/export", validateRequest(adminExportQuerySchema, "query"), AdminController.exportData);

export default router;
