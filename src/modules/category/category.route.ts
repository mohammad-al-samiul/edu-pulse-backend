import { Router } from "express";
import { CategoryController } from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { CategoryValidation } from "./category.validation";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  auth("SUPER_ADMIN", "ADMIN"),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory,
);

router.get("/", CategoryController.getAllCategories);

router.patch(
  "/:id",
  auth("SUPER_ADMIN", "ADMIN"),
  validateRequest(CategoryValidation.updateCategorySchema),
  CategoryController.updateCategory,
);

router.delete(
  "/:id",
  auth("SUPER_ADMIN", "ADMIN"),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
