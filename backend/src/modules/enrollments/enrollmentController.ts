import type { Request, Response } from "express";
import { EnrollmentService } from "./enrollmentService.js";

export class EnrollmentController {
  static async create(req: Request, res: Response) {
    try {
      const studentId = (req as any).user.userId;
      const { course_id } = req.body;
      const enrollment = await EnrollmentService.requestEnrollment(
        studentId,
        course_id,
      );
      return res.status(201).json({ success: true, data: enrollment });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = (req as any).params;
      const { status } = req.body;
      const adminId = (req as any).user.id;
      const updated = await EnrollmentService.updateStatus(id, status, adminId);
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const { status, course_id } = req.query;
      const filter: any = {};
      if (status) filter.status = status;
      if (course_id) filter.course_id = course_id;

      const enrollments = await EnrollmentService.getEnrollments(filter);
      return res.status(200).json({ success: true, data: enrollments });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  static async getMyEnrollments(req: Request, res: Response) {
    try {
      const currentUser = (req as any).user;
      let targetStudentId = (req as any).params.studentId;

      if (currentUser.role === "student") {
        targetStudentId = currentUser.id;
      } else if (
        (currentUser.role === "admin" || currentUser.role === "teacher") &&
        !targetStudentId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "The required student identifier (studentId) must be specified.",
        });
      }
      const enrollments =
        await EnrollmentService.getStudentEnrollments(targetStudentId);

      return res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  static async getCourseStudents(req: Request, res: Response) {
    try {
      const { courseId } = (req as any).params;
      const students = await EnrollmentService.getStudentsByCourse(courseId);
      return res
        .status(200)
        .json({ success: true, count: students.length, data: students });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
