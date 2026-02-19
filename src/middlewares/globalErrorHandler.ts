import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";
import { handleZodError } from "../errors/handleZodError";
import { handleMongooseError } from "../errors/handleMongooseError";
import { handleJWTError } from "../errors/handleJWTError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails: any = [];

  if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "JsonWebTokenError") {
    const simplified = handleJWTError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
  } else {
    const simplified = handleMongooseError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};
