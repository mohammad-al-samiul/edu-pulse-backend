import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create",
  validateRequest(UserValidation.createUserSchema),
  UserController.createUser
);

router.get(
  "/",
  auth("SUPER_ADMIN", "ADMIN"),
  UserController.getAllUsers
);

router.delete(
  "/:id",
  auth("SUPER_ADMIN"),
  UserController.deleteUser
);

export const UserRoutes = router;
