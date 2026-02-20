import bcrypt from "bcrypt";
import { IUser } from "./user.interface";
import { UserRepository } from "./user.repository";

import { AppError } from "../../errors/AppError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { RefreshTokenRepository } from "./refreshToken.repository";

//////////////////////////////////////////////////
// CREATE USER
//////////////////////////////////////////////////

const createUser = async (payload: IUser) => {
  const existingUser = await UserRepository.findByEmailWithPassword(
    payload.email,
  );

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UserRepository.createUser({
    ...payload,
    password: hashedPassword,
  });

  return user;
};

//////////////////////////////////////////////////
// LOGIN USER
//////////////////////////////////////////////////

const loginUser = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await UserRepository.findByEmailWithPassword(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status === "SUSPENDED") {
    throw new AppError("User is suspended", 403);
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError("Invalid email or password", 401);
  }

  const payloadForToken = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = generateAccessToken(payloadForToken);
  const refreshToken = generateRefreshToken(payloadForToken);

  await RefreshTokenRepository.createToken(
    refreshToken,
    user.id,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );

  return {
    accessToken,
    refreshToken,
  };
};

//////////////////////////////////////////////////
// REFRESH ACCESS TOKEN
//////////////////////////////////////////////////

const refreshAccessToken = async (token: string) => {
  const storedToken = await RefreshTokenRepository.findToken(token);

  if (!storedToken) {
    throw new AppError("Invalid refresh token", 403);
  }

  if (storedToken.expiresAt < new Date()) {
    throw new AppError("Refresh token expired", 403);
  }

  const decoded: any = verifyRefreshToken(token);

  const newAccessToken = generateAccessToken({
    userId: decoded.userId,
    role: decoded.role,
  });

  return { accessToken: newAccessToken };
};

//////////////////////////////////////////////////
// LOGOUT USER
//////////////////////////////////////////////////

const logoutUser = async (refreshToken: string) => {
  await RefreshTokenRepository.deleteToken(refreshToken);
  return null;
};

//////////////////////////////////////////////////
// GET ALL USERS (SAFE)
//////////////////////////////////////////////////

const getAllUsers = async () => {
  return UserRepository.findAllSafe();
};

//////////////////////////////////////////////////
// UPDATE USER (RBAC Safe)
//////////////////////////////////////////////////

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
  requester: any,
) => {
  const user = await UserRepository.findSafeById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // SUPER_ADMIN → full access
  if (requester.role === "SUPER_ADMIN") {
    return UserRepository.updateById(id, payload);
  }

  // ADMIN → cannot modify SUPER_ADMIN
  if (requester.role === "ADMIN") {
    if (user.role === "SUPER_ADMIN") {
      throw new AppError("Cannot modify Super Admin", 403);
    }

    return UserRepository.updateById(id, payload);
  }

  throw new AppError("Unauthorized access", 403);
};

//////////////////////////////////////////////////
// DELETE USER (SOFT DELETE)
//////////////////////////////////////////////////

const deleteUser = async (id: string) => {
  const user = await UserRepository.findSafeById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await UserRepository.softDelete(id);
  return null;
};

export const UserService = {
  createUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
