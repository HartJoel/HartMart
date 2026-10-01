import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  deleteNotification,
  getNotificationById,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "./notification.controller.js";
import { validateIdParam } from "../../shared/middleware/validate.id-param.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.get("/:notificationId", validateIdParam("notificationId"), getNotificationById);
router.patch("/:notificationId/read", validateIdParam("notificationId"), markAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:notificationId", validateIdParam("notificationId"), deleteNotification);

export default router;
