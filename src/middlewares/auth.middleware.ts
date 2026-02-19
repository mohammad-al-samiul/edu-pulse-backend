import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { AppError } from "../errors/AppError";

export const auth = (...requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      return next(new AppError("You are not authorized", 401));
    }

    try {
      const decoded = jwt.verify(token, config.jwt_secret) as any;

      req.user = decoded;

      // Role based check
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        return next(new AppError("Forbidden access", 403));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
