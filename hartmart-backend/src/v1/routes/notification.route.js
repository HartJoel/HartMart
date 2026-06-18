import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  deleteNotification,
  getNotificationById,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.get("/:notificationId", getNotificationById);
router.patch("/:notificationId/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:notificationId", deleteNotification);

export default router;
