import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { LessonService } from "./lesson.service";

const createLesson = catchAsync(async (req: Request, res: Response) => {
  const instructorId = (req as any).user.id;

  const result = await LessonService.createLesson(req.body, instructorId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Lesson created successfully",
    data: result,
  });
});

const markComplete = catchAsync(async (req: Request, res: Response) => {
  const studentId = (req as any).user.id;

  const result = await LessonService.markLessonComplete(
    req.params.lessonId as string,
    studentId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lesson completed",
    data: result,
  });
});

export const LessonController = {
  createLesson,
  markComplete,
};
