import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  auth("STUDENT", "INSTRUCTOR", "ADMIN", "SUPER_ADMIN"),
  NotificationController.getNotifications,
);

export const NotificationRoutes = router;
