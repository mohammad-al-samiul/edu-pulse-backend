import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters"),

    email: z.string().min(1, "Email is required").email("Invalid email format"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),

    role: z.enum(["SUPER_ADMIN", "ADMIN", "INSTRUCTOR", "STUDENT"]).optional(),
  }),
});

const loginUserSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "INSTRUCTOR", "STUDENT"]).optional(),
    status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
  }),
});

export const UserValidation = {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
};
