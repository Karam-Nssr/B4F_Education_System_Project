import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../users/User.js";

export class AuthService {
  
  static async register(userData: any) {
    const { first_name, last_name, phone_number, email, password, role } = userData;

    if (!email) {
      throw new Error("Email is required.");
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error("Email is already in use.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      first_name,
      last_name,
      phone_number,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    const secretKey: string = process.env.JWT_SECRET ?? "super-secret-key";
    const token = jwt.sign(
      {
        userId: newUser.id,
        role: newUser.role,
        tokenVersion: newUser.tokenVersion ?? 0,
      },
      secretKey,
      { expiresIn: "1d" }
    );
    return {
      token,
      user: newUser.toJSON(),
    };
  }

  static async login(credentials: any) {
    const { email, password } = credentials;

    if (!email) {
      throw new Error("Email is required.");
    }

    const user = await UserModel.findOne({ email }).select("+password +tokenVersion");
    if (!user || !user.password) {
      throw new Error("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password.");
    }

    const secretKey: string = process.env.JWT_SECRET ?? "super-secret-key";
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        tokenVersion: user.tokenVersion ?? 0,
      },
      secretKey,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: user.toJSON(),
    };
  }

  static async logout(userId: string) {
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { tokenVersion: 1 },
    });
  }
}