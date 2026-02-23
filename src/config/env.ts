import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";
dotenv.config();

export const config = {
  port: process.env.PORT,
  db_url: process.env.DB_URL as string,
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_expires_in: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  jwt_refresh_expires_in: process.env
    .JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  redis_url: process.env.REDIS_URL as string,
  redis_token: process.env.REDIS_TOKEN as string,
  rabbitmq_url: process.env.RABBITMQ_URL as string,
};
