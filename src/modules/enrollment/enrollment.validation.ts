import { z } from "zod";

const enrollSchema = z.object({
  params: z.object({
    courseId: z.string(),
  }),
});

export const EnrollmentValidation = {
  enrollSchema,
};
