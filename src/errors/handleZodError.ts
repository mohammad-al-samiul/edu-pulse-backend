import { ZodError } from "zod";

export const handleZodError = (error: ZodError) => {
  const formattedErrors = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation Error",
    errorDetails: formattedErrors,
  };
};
