import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { CourseRoutes } from "../modules/course/course.route";

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
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/courses",
    route: CourseRoutes,
  },
  // {
  //   path: "/lessons",
  //   route: LessonRoutes,
  // },
  // {
  //   path: "/enrollments",
  //   route: EnrollmentRoutes,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
