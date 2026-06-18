import NotificationRepository from "../repositories/notification.respository.js";
import AppError from "../utils/AppError.js";

class NotificationService {
  static async create(data) {
    return NotificationRepository.create(data);
  }

  static async getUserNotifications(userId) {
    return NotificationRepository.findByUser(userId);
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
      throw new AppError("Forbidden", 403);
    }

    return NotificationRepository.update(notificationId, {
      isRead: true,
      readAt: new Date(),
    });
  }

  static async markAllAsRead(userId) {
    return NotificationRepository.markAllAsRead(userId);
  }

  static async delete(notificationId, userId) {
    const notification = await NotificationRepository.findById(notificationId);

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    if (notification.userId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    return NotificationRepository.delete(notificationId);
  }
}

export default NotificationService;
