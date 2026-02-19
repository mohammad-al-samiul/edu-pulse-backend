import { config } from "./env";
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.db_url);
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error);
    process.exit(1);
  }
};
