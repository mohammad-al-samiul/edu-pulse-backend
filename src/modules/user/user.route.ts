import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create",
  validateRequest(UserValidation.createUserSchema),
  UserController.createUser,
);

router.post(
  "/login",
  validateRequest(UserValidation.loginUserSchema),
  UserController.loginUser,
);

router.get("/", auth("SUPER_ADMIN", "ADMIN"), UserController.getAllUsers);

router.patch(
  "/:id",
  auth("SUPER_ADMIN", "ADMIN"),
  validateRequest(UserValidation.updateUserSchema),
  UserController.updateUser,
);

router.delete("/:id", auth("SUPER_ADMIN"), UserController.deleteUser);

export const UserRoutes = router;
