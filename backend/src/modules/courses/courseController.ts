import type { Request, Response } from "express";
import { CourseService } from "./courseService.js";

export class CourseController {
  static async create(req: Request, res: Response) {
    try {
      const course = await CourseService.createCourse(req.body);
      return res.status(201).json({ success: true, course: course });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const currentUser = (req as any).user;
      const courses = await CourseService.getAllCourses(currentUser);

      return res.status(200).json({
        success: true,
        count: courses.length,
        courses: courses
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  static async getCourseById(req: Request, res: Response) {
    try {
      const course = await CourseService.getCourseById((req as any).params.id);
      return res.status(200).json({
        success: true,
        course: course,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
  static async updateCourse(req: Request, res: Response) {
    try {
      const courseId = (req as any).params.id;
      const updatedCourse = await CourseService.updateCourse(
        courseId,
        req.body,
      );
      return res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  static async draftCourse(req: Request, res: Response) {
    try {
      const courseId = (req as any).params.id;
      const course = await CourseService.deleteCourse(courseId);
      return res.status(200).json({
        success: true,
        message: "Course status changed to draft successfully",
        data: course,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}
