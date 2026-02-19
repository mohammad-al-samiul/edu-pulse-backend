import { IUser } from "./user.interface";
import { UserRepository } from "./user.repository";
import { AppError } from "../../errors/AppError";

import { config } from "../../config/env";
import { generateToken } from "../../utils/jwt";

const createUser = async (payload: IUser) => {
  const existingUser = await UserRepository.findByEmail(payload.email);

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const result = await UserRepository.createUser(payload);
  return result;
};

const loginUser = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status === "SUSPENDED") {
    throw new AppError("User is suspended", 403);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new AppError("Invalid email or password", 401);
  }

  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_secret,
    config.jwt_expires_in,
  );

  return {
    accessToken,
  };
};

const getAllUsers = async () => {
  return await UserRepository.findAll();
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
  requester: any,
) => {
  const user = await UserRepository.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // SUPER_ADMIN full access
  if (requester.role === "SUPER_ADMIN") {
    return await UserRepository.updateById(id, payload);
  }

  //  ADMIN cannot modify SUPER_ADMIN
  if (requester.role === "ADMIN") {
    if (user.role === "SUPER_ADMIN") {
      throw new AppError("Cannot modify Super Admin", 403);
    }

    return await UserRepository.updateById(id, payload);
  }

  throw new AppError("Unauthorized access", 403);
};

const deleteUser = async (id: string) => {
  const deleted = await UserRepository.softDelete(id);

  if (!deleted) {
    throw new AppError("User not found", 404);
  }

  return null;
};

export const UserService = {
  createUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
