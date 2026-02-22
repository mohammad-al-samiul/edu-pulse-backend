import { Router } from "express";
import { CourseController } from "./course.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { CourseValidation } from "./course.validation";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  auth("INSTRUCTOR", "ADMIN", "SUPER_ADMIN"),
  validateRequest(CourseValidation.createCourseSchema),
  CourseController.createCourse,
);

router.get("/", CourseController.getAllCourses);

router.get("/:id", CourseController.getSingleCourse);

router.patch(
  "/:id",
  auth("INSTRUCTOR", "ADMIN", "SUPER_ADMIN"),
  validateRequest(CourseValidation.updateCourseSchema),
  CourseController.updateCourse,
);

export const CourseRoutes = router;
