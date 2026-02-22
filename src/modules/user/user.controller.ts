import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";

//////////////////////////////////////////////////
// CREATE USER
//////////////////////////////////////////////////

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

//////////////////////////////////////////////////
// LOGIN USER
//////////////////////////////////////////////////

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.loginUser(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

//////////////////////////////////////////////////
// REFRESH ACCESS TOKEN
//////////////////////////////////////////////////

const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const result = await UserService.refreshAccessToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Access token refreshed successfully",
    data: result,
  });
});

//////////////////////////////////////////////////
// LOGOUT USER
//////////////////////////////////////////////////

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  await UserService.logoutUser(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged out successfully",
  });
});

//////////////////////////////////////////////////
// GET ALL USERS
//////////////////////////////////////////////////

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

//////////////////////////////////////////////////
// GET SINGLE USER
//////////////////////////////////////////////////

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

//////////////////////////////////////////////////
// UPDATE USER
//////////////////////////////////////////////////

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUser(
    req.params.id as string,
    req.body,
    req.user,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

//////////////////////////////////////////////////
// DELETE USER
//////////////////////////////////////////////////

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await UserService.deleteUser(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
  });
});

export const UserController = {
  createUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
};
