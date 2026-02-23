import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/summary",
  auth("SUPER_ADMIN", "ADMIN"),
  AnalyticsController.getSummary,
);

router.get(
  "/enrollment-growth",
  auth("SUPER_ADMIN", "ADMIN"),
  AnalyticsController.getEnrollmentGrowth,
);

router.get(
  "/top-courses",
  auth("SUPER_ADMIN", "ADMIN"),
  AnalyticsController.getTopCourses,
);

router.get(
  "/revenue",
  auth("SUPER_ADMIN", "ADMIN"),
  AnalyticsController.getRevenue,
);

export const AnalyticsRoutes = router;
