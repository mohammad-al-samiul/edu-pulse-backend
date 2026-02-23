import { z } from "zod";

const createLessonSchema = z.object({
  body: z.object({
    title: z
      .string({ message: "Title is required" })
      .min(3, "Title must be at least 3 characters"),

    content: z.string().optional(),

    videoUrl: z.string().url("Invalid video URL").optional(),

    order: z
      .number({ message: "Order is required" })
      .int("Order must be an integer")
      .min(1, "Order must be at least 1"),

    isPreview: z.boolean().optional(),

    courseId: z.string({ message: "Course ID is required" }),
  }),
});

const markCompleteSchema = z.object({
  params: z.object({
    lessonId: z.string({ message: "Lesson ID is required" }),
  }),
});

export const LessonValidation = {
  createLessonSchema,
  markCompleteSchema,
};
