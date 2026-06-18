import { prisma } from "../config/db.js";

class NotificationRepository {
  static async create(data) {
    return prisma.notification.create({
      data,
    });
  }

  static async findByUser(userId) {
    return prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async markAllAsRead(userId) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  static async update(notificationId) {
    return prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  static async findById(notificationId) {
    return prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });
  }

  static async delete(notificationId, userId) {
    return prisma.notification.delete({
      where: {
        id: notificationId,
        userId,
      },
    });
  }
}

export default NotificationRepository;
