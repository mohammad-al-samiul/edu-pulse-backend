import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { NotificationService } from "./notification.service";

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await NotificationService.getUserNotifications(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications retrieved",
    data: result,
  });
});

export const NotificationController = {
  getNotifications,
};
