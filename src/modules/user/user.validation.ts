import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "INSTRUCTOR", "STUDENT"]).optional(),
  }),
});

export const UserValidation = {
  createUserSchema,
};
