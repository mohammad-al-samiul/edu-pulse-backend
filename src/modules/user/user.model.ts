import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserMethods } from "./user.interface";

const userSchema = new Schema<IUser, {}, IUserMethods>(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR", "STUDENT"],
      default: "STUDENT",
      index: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

// Password Hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Password Comparing
userSchema.methods.comparePassword = async function (plainPassword: string) {
  return await bcrypt.compare(plainPassword, this.password);
};

export const User = mongoose.model<
  IUser,
  mongoose.Model<IUser, {}, IUserMethods>
>("User", userSchema);
