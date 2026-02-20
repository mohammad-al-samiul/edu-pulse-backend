import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { config } from "../config/env";
import { AppError } from "../errors/AppError";
import prisma from "../config/prisma";

export const auth =
  (...allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Unauthorized access", 401);
      }

      const token = authHeader.split(" ")[1];

      const decoded: any = jwt.verify(token, config.jwt_secret);

      const user = await prisma.user.findFirst({
        where: {
          id: decoded.userId,
          deletedAt: null,
        },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (user.status === "SUSPENDED") {
        throw new AppError("User is suspended", 403);
      }

      // Attach user to request
      (req as any).user = user;

      // Role based restriction
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        throw new AppError("Forbidden", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
