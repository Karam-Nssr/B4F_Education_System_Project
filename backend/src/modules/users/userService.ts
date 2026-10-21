import { UserModel } from "./User.js";
import type { IUser } from "./User.js";
import bcrypt from "bcrypt";

export class UserService {
  static async getProfile(userId: string): Promise<IUser> {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  static async updateProfile(
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser> {
    const allowedUpdates = {
      first_name: updateData.first_name,
      last_name: updateData.last_name,
      phone_number: updateData.phone_number,
    };

    const user = await UserModel.findByIdAndUpdate(userId, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    if (!user) throw new Error("User not found");
    return user;
  }

  static async getAllUsers(filter: object = {}): Promise<IUser[]> {
    return await UserModel.find({...filter,role: { $ne: "admin"}}).sort({ createdAt: -1 });
  }

  static async createUser(data: Partial<IUser>): Promise<IUser> {
    if (!data.email) {
      throw new Error("Email is required");
    }
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) throw new Error("Email is already in use");
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const user = await UserModel.create(data);
    return user;
  }

  static async updateUser(
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  static async changeUserStatus(
    userId: string,
    status: "active" | "inactive" | "suspended",
  ): Promise<IUser> {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    user.status = status;
    await user.save();
    return user;
  }
}
