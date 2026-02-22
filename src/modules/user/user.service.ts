import bcrypt from "bcrypt";
import crypto from "crypto";
import { IUser } from "./user.interface";
import { UserRepository } from "./user.repository";
import { RefreshTokenRepository } from "./refreshToken.repository";
import { AppError } from "../../errors/AppError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { CacheService } from "../../redis/cache.service";
import { publishEvent } from "../../queue/publisher";

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
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    role: payload.role ?? "STUDENT",
    status: payload.status ?? "ACTIVE",
    deletedAt: null,
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

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await RefreshTokenRepository.createToken(
    hashedToken,
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
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const storedToken = await RefreshTokenRepository.findToken(hashedToken);

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
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await RefreshTokenRepository.deleteToken(hashedToken);

  return null;
};

//////////////////////////////////////////////////
// GET ALL USERS (REDIS CACHED)
//////////////////////////////////////////////////

const getAllUsers = async () => {
  const cacheKey = "users:list";

  const cached = await CacheService.getCache(cacheKey);
  if (cached !== null) return cached;

  const users = await UserRepository.findAllSafe();

  await CacheService.setCache(cacheKey, users, 120);

  return users;
};

//////////////////////////////////////////////////
// GET SINGLE USER (REDIS CACHED)
//////////////////////////////////////////////////

const getUserById = async (id: string) => {
  const cacheKey = `user:${id}`;

  const cached = await CacheService.getCache(cacheKey);
  if (cached !== null) return cached;

  const user = await UserRepository.findSafeById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await CacheService.setCache(cacheKey, user, 300);

  return user;
};

//////////////////////////////////////////////////
// UPDATE USER (RBAC SAFE + CACHE INVALIDATION)
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

  if (requester.role !== "SUPER_ADMIN" && requester.role !== "ADMIN") {
    throw new AppError("Unauthorized access", 403);
  }

  if (requester.role === "ADMIN" && user.role === "SUPER_ADMIN") {
    throw new AppError("Cannot modify Super Admin", 403);
  }

  const updated = await UserRepository.updateById(id, payload);

  // simple invalidation
  await CacheService.deleteCache(`user:${id}`);
  await CacheService.deleteCache("users:list");

  return updated;
};

//////////////////////////////////////////////////
// DELETE USER (SOFT DELETE + CACHE INVALIDATION)
//////////////////////////////////////////////////

const deleteUser = async (id: string) => {
  const user = await UserRepository.findSafeById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await UserRepository.softDelete(id);

  await CacheService.deleteCache(`user:${id}`);
  await CacheService.deleteCache("users:list");

  return null;
};
export const UserService = {
  createUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
