import { Router } from "express";
import { LessonController } from "./lesson.controller";
import { auth } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { LessonValidation } from "./lesson.validation";

const router = Router();

router.post(
  "/",
  auth("INSTRUCTOR"),
  validateRequest(LessonValidation.createLessonSchema),
  LessonController.createLesson,
);

router.post(
  "/complete/:lessonId",
  auth("STUDENT"),
  validateRequest(LessonValidation.markCompleteSchema),
  LessonController.markComplete,
);
export const LessonRoutes = router;
