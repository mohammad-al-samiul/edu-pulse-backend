import mongoose from "mongoose";

export const handleMongooseError = (err: any) => {
  let statusCode = 400;
  let message = "Database Error";
  let errorDetails: { path: string; message: string }[] = [];

  // 🔴 Duplicate Key Error
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0];

    message = "Duplicate Field Value";

    errorDetails = [
      {
        path: field,
        message: `${field} already exists`,
      },
    ];
  }

  // 🟠 Validation Error
  else if (err instanceof mongoose.Error.ValidationError) {
    message = "Validation Error";

    errorDetails = Object.values(err.errors).map((error: any) => ({
      path: error.path,
      message: error.message,
    }));
  }

  // 🟡 Cast Error
  else if (err instanceof mongoose.Error.CastError) {
    message = "Invalid ID";

    errorDetails = [
      {
        path: err.path,
        message: `Invalid ${err.path}`,
      },
    ];
  }

  // ⚪ Fallback
  else {
    statusCode = 500;
    message = "Something went wrong";

    errorDetails = [
      {
        path: "",
        message: err?.message || "Unexpected error",
      },
    ];
  }

  return {
    statusCode,
    message,
    errorDetails,
  };
};
