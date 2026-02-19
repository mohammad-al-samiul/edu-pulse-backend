import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const handleJWTError = (err: any) => {
  let message = "Authentication Failed";

  if (err instanceof TokenExpiredError) {
    message = "Token has expired";
  } else if (err instanceof JsonWebTokenError) {
    message = "Invalid token";
  }

  return {
    statusCode: 401,
    message,
    errorDetails: [
      {
        path: "",
        message,
      },
    ],
  };
};
