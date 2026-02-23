import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { EnrollmentService } from "./enrollment.service";

const enrollCourse = catchAsync(async (req: Request, res: Response) => {
  const studentId = (req as any).user.id;
  const { courseId } = req.params;

  const result = await EnrollmentService.enrollCourse(
    courseId as string,
    studentId,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Enrolled successfully",
    data: result,
  });
});

export const EnrollmentController = {
  enrollCourse,
};
