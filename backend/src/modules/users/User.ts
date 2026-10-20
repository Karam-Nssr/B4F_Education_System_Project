import { Schema, model } from "mongoose";

export type UserRole = "admin" | "teacher" | "student";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model("User", userSchema);
