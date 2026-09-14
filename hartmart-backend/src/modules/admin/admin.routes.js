import express from "express";
import { requireRole, requireRoles } from "../../shared/middleware/rbac.middleware.js";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import AdminController from "./admin.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.use(requireRoles("ADMIN"));

router.get("/dashboard", AdminController.getDashboardAnalytics);
router.get("/reports", AdminController.getPlatformReports);
router.get("/users", AdminController.getUsers);
router.get("/logs", AdminController.getAuditLogs);
router.get("/export", AdminController.exportData);

export default router;
