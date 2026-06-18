import NotificationService from "../../services/notification.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const notifications = await NotificationService.getUserNotifications(userId);

  res.status(200).json({
    success: true,
    data: notifications,
  });
});

const getNotificationById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.params;

  const notification = await NotificationService.getById(notificationId);

  if (notification.userId !== userId) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  res.status(200).json({
    success: true,
    data: notification,
  });
});
const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.params;

  const updated = await NotificationService.markAsRead(notificationId, userId);

  res.status(200).json({
    success: true,
    data: updated,
  });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await NotificationService.markAllAsRead(userId);

  res.status(200).json({
    success: true,
    updated: result.count,
  });
});

const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.params;

  await NotificationService.delete(notificationId, userId);

  res.status(204).send();
});

export {
  getNotificationById,
  getNotifications,
  markAllAsRead,
  markAsRead,
  deleteNotification,
};
