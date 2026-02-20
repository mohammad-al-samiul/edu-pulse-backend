import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { handleZodError } from "../errors/handleZodError";
import { handleJWTError } from "../errors/handleJWTError";
import { handlePrismaError } from "../errors/handlePrismaError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails: any[] = [];

  // Zod Validation Error
  if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  }

  // Custom App Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  // JWT Error
  else if (err.name === "JsonWebTokenError") {
    const simplified = handleJWTError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  }

  // Prisma Errors
  else if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    const simplified = handlePrismaError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorDetails = simplified.errorDetails;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};
