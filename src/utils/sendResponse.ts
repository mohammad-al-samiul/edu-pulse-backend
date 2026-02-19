import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
  },
) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    data: data.data || null,
  });
};

/*
  sendResponse(res, {
  statusCode: 200,
  success: true,
  message: "User retrieved successfully",
  data: {
    name: "Rahim",
    email: "rahim@gmail.com"
  }
});
*/
