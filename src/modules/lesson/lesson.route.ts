import { Router } from "express";
import { LessonController } from "./lesson.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", auth("INSTRUCTOR"), LessonController.createLesson);

router.post(
  "/complete/:lessonId",
  auth("STUDENT"),
  LessonController.markComplete,
);

export const LessonRoutes = router;
