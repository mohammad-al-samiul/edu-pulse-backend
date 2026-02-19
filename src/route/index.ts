import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

/**
 * Centralized Route Registration
 * All module routes will be registered here
 */

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  // {
  //   path: "/courses",
  //   route: CourseRoutes,
  // },
  // {
  //   path: "/lessons",
  //   route: LessonRoutes,
  // },
  // {
  //   path: "/enrollments",
  //   route: EnrollmentRoutes,
  // },
  // {
  //   path: "/categories",
  //   route: CategoryRoutes,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
