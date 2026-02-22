import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
  }),
});

export const CategoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
