import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import {
  deleteNotification,
  getNotificationById,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "./notification.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.get("/:notificationId", getNotificationById);
router.patch("/:notificationId/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:notificationId", deleteNotification);

export default router;
