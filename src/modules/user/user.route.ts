import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

//////////////////////////////////////////////////
// AUTH ROUTES
//////////////////////////////////////////////////

router.post(
  "/register",
  validateRequest(UserValidation.createUserSchema),
  UserController.createUser,
);

router.post(
  "/login",
  validateRequest(UserValidation.loginUserSchema),
  UserController.loginUser,
);

router.post("/refresh-token", UserController.refreshAccessToken);

router.post("/logout", UserController.logoutUser);

//////////////////////////////////////////////////
// USER MANAGEMENT ROUTES (RBAC)
//////////////////////////////////////////////////

router.get("/", auth("SUPER_ADMIN", "ADMIN"), UserController.getAllUsers);

router.patch(
  "/:id",
  auth("SUPER_ADMIN", "ADMIN"),
  validateRequest(UserValidation.updateUserSchema),
  UserController.updateUser,
);

router.delete("/:id", auth("SUPER_ADMIN"), UserController.deleteUser);

export const UserRoutes = router;
