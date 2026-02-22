import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CourseService } from "./course.service";

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const instructorId = (req as any).user.id;

  const result = await CourseService.createCourse(req.body, instructorId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Course created successfully",
    data: result,
  });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getAllCourses(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Courses retrieved successfully",
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getSingleCourse(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course retrieved successfully",
    data: result,
  });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.updateCourse(
    req.params.id as string,
    req.body,
    (req as any).user,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Course updated successfully",
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
};
