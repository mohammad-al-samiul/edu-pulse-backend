import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT,
  db_url: process.env.DB_URL as string,
  jwt_secret: process.env.JWT_SECRET as string,
};
