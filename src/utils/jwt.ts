import jwt from "jsonwebtoken";
import { config } from "../config/env";

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, config.jwt_secret, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, config.jwt_refresh_secret, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwt_refresh_secret);
};
