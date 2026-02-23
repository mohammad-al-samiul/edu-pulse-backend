import { Router } from "express";
import { EnrollmentController } from "./enrollment.controller";
import { EnrollmentValidation } from "./enrollment.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/:courseId",
  auth("STUDENT"),
  validateRequest(EnrollmentValidation.enrollSchema),
  EnrollmentController.enrollCourse,
);

export const EnrollmentRoutes = router;
