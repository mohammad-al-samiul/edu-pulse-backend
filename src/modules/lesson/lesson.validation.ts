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

//////////////////////////////////////////////////////
// UPDATE LESSON
//////////////////////////////////////////////////////

const updateLessonSchema = z.object({
  body: z.object({
    // .optional() থাকলে ফিল্ডটি না পাঠালেও চলবে,
    // কিন্তু পাঠালে অবশ্যই ৩ অক্ষরের বেশি হতে হবে।
    title: z.string().min(3, "Title must be at least 3 characters").optional(),

    content: z.string().optional(),

    videoUrl: z.string().url("Invalid video URL format").optional(),

    order: z
      .number()
      .int("Order must be an integer")
      .min(1, "Order must be at least 1")
      .optional(),

    isPreview: z.boolean().optional(),
  }),
});

export const LessonValidation = {
  createLessonSchema,
  updateLessonSchema,
  markCompleteSchema,
};
