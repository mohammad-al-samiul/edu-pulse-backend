import { CategoryRepository } from "./category.repository";
import { AppError } from "../../errors/AppError";

const createCategory = async (payload: { name: string }) => {
  return CategoryRepository.createCategory(payload);
};

const getAllCategories = async () => {
  return CategoryRepository.findAll();
};

const updateCategory = async (id: string, payload: any) => {
  const category = await CategoryRepository.findById(id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return CategoryRepository.updateById(id, payload);
};

const deleteCategory = async (id: string) => {
  const category = await CategoryRepository.findById(id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return CategoryRepository.deleteById(id);
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
