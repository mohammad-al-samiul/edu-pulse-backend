import { NotificationRepository } from "./notification.repository";
import { CacheService } from "../../redis/cache.service";

const createNotification = async (data: any) => {
  const notification = await NotificationRepository.createNotification(data);

  // Redis invalidate
  await CacheService.deleteCache(`notifications:${data.userId}`);

  return notification;
};

const getUserNotifications = async (userId: string) => {
  const cacheKey = `notifications:${userId}`;

  const cached = await CacheService.getCache(cacheKey);
  if (cached) return cached;

  const notifications = await NotificationRepository.findByUser(userId);

  await CacheService.setCache(cacheKey, notifications, 120);

  return notifications;
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
};
