import NotificationRepository from "./notification.repository.js";
import AppError from "../../shared/utils/AppError.js";
import logger from "../../shared/utils/logger.js";

class NotificationService {
  static async create(data) {
    const notification = await NotificationRepository.create(data);
    logger.info("Notification created", { notificationId: notification.id, userId: data.userId, type: data.type });
    return notification;
  }

  static async getUserNotifications(userId) {
    const notifications = await NotificationRepository.findByUser(userId);
    logger.info("User notifications retrieved", { userId, notificationCount: notifications.length });
    return notifications;
  }

  static async getById(notificationId) {
    const notification = await NotificationRepository.findById(notificationId);

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return notification;
  }

  static async markAsRead(notificationId, userId) {
    const notification = await NotificationRepository.findById(notificationId);

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    if (notification.userId !== userId) {
      throw new AppError("You do not have permission to update this notification.", 403);
    }

    const updatedNotification = await NotificationRepository.update(notificationId, {
      isRead: true,
      readAt: new Date(),
    });
    logger.info("Notification marked as read", { userId, notificationId });
    return updatedNotification;
  }

  static async markAllAsRead(userId) {
    const result = await NotificationRepository.markAllAsRead(userId);
    logger.info("All notifications marked as read", { userId, updatedCount: result.count });
    return result;
  }

  static async delete(notificationId, userId) {
    const notification = await NotificationRepository.findById(notificationId);

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    if (notification.userId !== userId) {
      throw new AppError("You do not have permission to delete this notification.", 403);
    }

    const result = await NotificationRepository.delete(notificationId, userId);
    logger.info("Notification deleted", { userId, notificationId });
    return result;
  }
}

export default NotificationService;
