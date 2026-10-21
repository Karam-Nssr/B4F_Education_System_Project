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
      const courses = await CourseService.getAllCourses();
      return res.status(200).json({ success: true, courses: courses });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}