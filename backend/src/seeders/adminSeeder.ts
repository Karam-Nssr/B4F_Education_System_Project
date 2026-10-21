import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { UserModel } from "../modules/users/User.js";
dotenv.config();
export const seedAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGO_URI is not defined in environment variables!");
    }
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    // Clear existing data
    await UserModel.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin@lms", salt);
    await UserModel.create({
      first_name: "System",
      last_name: "Admin",
      phone_number: 963900000000,
      email: "admin@lms.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    console.log("Default Admin account created successfully!");
  } catch (error: any) {
    console.error("Error seeding admin account:", error.message);
  }
};
seedAdmin();
