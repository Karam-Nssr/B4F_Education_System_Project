import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/authMiddleware.js";
import * as AuthService from "./authService.js";

export const register = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message === "Email is already in use." ? 400 : 500;
    res.status(statusCode).json({ message: err.message });
  }
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json({
      message: "Logged in successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message === "Invalid email or password." ? 401 : 500;
    res.status(statusCode).json({ message: err.message });
  }
};

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthenticated." });
      return;
    }

    const user = await AuthService.getProfile(req.user.userId);
    res.status(200).json(user);
  } catch (error) {
    const err = error as Error;
    const statusCode = err.message === "User not found." ? 404 : 500;
    res.status(statusCode).json({ message: err.message });
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthenticated." });
      return;
    }

    await AuthService.logout(req.user.userId);
    res
      .status(200)
      .json({ message: "Logged out successfully from all devices." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  }
};
