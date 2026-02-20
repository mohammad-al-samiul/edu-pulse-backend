import { Prisma } from "@prisma/client";

export const handlePrismaError = (err: any) => {
  let statusCode = 400;
  let message = "Database error";
  let errorDetails: any[] = [];

  // Known Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplicate field value";
        errorDetails = [
          {
            path: err.meta?.target,
            message: "This value already exists",
          },
        ];
        break;

      case "P2003":
        statusCode = 400;
        message = "Invalid relation reference";
        errorDetails = [
          {
            path: "",
            message: "Related record not found",
          },
        ];
        break;

      case "P2025":
        statusCode = 404;
        message = "Record not found";
        errorDetails = [
          {
            path: "",
            message: "Requested resource does not exist",
          },
        ];
        break;

      default:
        statusCode = 400;
        message = err.message;
        errorDetails = [
          {
            path: "",
            message: err.message,
          },
        ];
    }
  }

  // Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid input data";
    errorDetails = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  return {
    statusCode,
    message,
    errorDetails,
  };
};
