import { AttendanceRecordModel, type IAttendanceRecord} from "./AttendanceRecord.js";
import { EnrollmentModel } from "../enrollments/Enrollment.js";
import { SessionModel } from "../sessions/Session.js"; 
import { CourseModel } from "../courses/Course.js";     

export class AttendanceService {

  static async recordAttendance(
    data: {
      session_id: string;
      student_id: string;
      status: 'present' | 'excused_absence' | 'unexcused_absence' | 'late';
      notes?: string;
    },
    currentUser: { id: string; role: string } 
  ): Promise<IAttendanceRecord> {
    
    const session = await SessionModel.findById(data.session_id);
    if (!session) {
      throw new Error("Session not found");
    }

    const course = await CourseModel.findById(session.course_id);
    if (!course) {
      throw new Error("Course not found");
    }

    if (currentUser.role === "teacher" && course.teacher.toString() !== currentUser.id) {
      throw new Error("Access denied. You are not the teacher assigned to this course.");
    }

    let record = await AttendanceRecordModel.findOne({
      session_id: data.session_id,
      student_id: data.student_id
    });

    const previousStatus = record ? record.status : null;

    if (record) {
      record.status = data.status;
      record.notes = data.notes!;
      record.checked_at = new Date();
      await record.save();
    } else {
      record = await AttendanceRecordModel.create({
        ...data,
        checked_at: new Date()
      });
    }


    if (data.status === "unexcused_absence" && previousStatus !== "unexcused_absence") {
      const enrollment = await EnrollmentModel.findOne({ 
        student_id: data.student_id, 
        course_id: session.course_id 
      });

      if (enrollment) {
        enrollment.absence_count = (enrollment.absence_count || 0) + 1;
        if (enrollment.absence_count >= 3) {
          enrollment.status = "suspended"; // تعليق التسجيل تلقائياً عند تجاوز 3 غيابات بدون عذر
        }
        await enrollment.save();
      }
    }

    return record;
  }

  static async getSessionAttendance(sessionId: string): Promise<IAttendanceRecord[]> {
    return await AttendanceRecordModel.find({ session_id: sessionId })
      .populate("student_id", "first_name last_name email");
  }
}