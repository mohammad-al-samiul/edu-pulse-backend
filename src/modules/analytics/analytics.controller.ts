import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AnalyticsService } from "./analytics.service";

const getSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsService.getSummary();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Analytics summary retrieved",
    data: result,
  });
});

const getEnrollmentGrowth = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsService.getEnrollmentGrowth();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Enrollment growth retrieved",
    data: result,
  });
});

const getTopCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsService.getTopCourses();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Top courses retrieved",
    data: result,
  });
});

const getRevenue = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsService.getRevenue();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Revenue data retrieved",
    data: result,
  });
});

export const AnalyticsController = {
  getSummary,
  getEnrollmentGrowth,
  getTopCourses,
  getRevenue,
};
