import type { Request, Response } from "express";
import { UserService } from "./userService.js";

export class UserController {
  static async updateMyProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const updatedUser = await UserService.updateProfile(userId, req.body);
      return res.status(200).json({ success: true, user: updatedUser });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const { role, status } = req.query;
      const filter: any = {};
      if (role) filter.role = role;
      if (status) filter.status = status;

      const users = await UserService.getAllUsers(filter);
      return res
        .status(200)
        .json({ success: true, count: users.length, users: users });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  static async getAllTeachers(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const filter: any = { role: 'teacher' };
      if (status) filter.status = status;

      const teachers = await UserService.getAllTeachers(filter);
      
      return res.status(200).json({ 
        success: true, 
        count: teachers.length, 
        teachers: teachers 
      });
    } catch (error: any) {
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  static async getUserProfile(req: Request, res: Response) {
    try {
      const currentUser = (req as any).user;
      let targetUserId = (req as any).params.id;

      if (!targetUserId || req.path.includes("/me")) {
        targetUserId = currentUser.id;
      }

      if (currentUser.role !== "admin" && targetUserId !== currentUser.id) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }
      const user = await UserService.getProfile(targetUserId);
      return res.status(200).json({ success: true, user: user });
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      return res.status(201).json({ success: true, user: user });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = (req as any).params;
      const updatedUser = await UserService.updateUser(id, req.body);
      return res.status(200).json({ success: true, user: updatedUser });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = (req as any).params;
      const { status } = req.body;
      const updatedUser = await UserService.changeUserStatus(id, status);
      return res.status(200).json({
        success: true,
        message: "User status updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
