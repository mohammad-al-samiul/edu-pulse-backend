import prisma from "../../config/prisma";

const createNotification = async (data: any) => {
  return prisma.notification.create({ data });
};

const findByUser = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const NotificationRepository = {
  createNotification,
  findByUser,
};
