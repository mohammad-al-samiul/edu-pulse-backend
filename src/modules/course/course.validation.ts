import { z } from "zod";

const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10),
    price: z.number().min(0),
    categoryId: z.string(),
    isFree: z.boolean().optional(),
  }),
});

const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    price: z.number().min(0).optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  }),
});

export const CourseValidation = {
  createCourseSchema,
  updateCourseSchema,
};
