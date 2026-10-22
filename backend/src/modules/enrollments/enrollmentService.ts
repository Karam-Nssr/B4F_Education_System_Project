import { EnrollmentModel,type IEnrollment } from "./Enrollment.js";
export class EnrollmentService {
  static async requestEnrollment(
    studentId: string,
    courseId: string,
  ): Promise<IEnrollment> {
    const existing = await EnrollmentModel.findOne({
      student_id: studentId,
      course_id: courseId
    });
    if (existing)
      throw new Error(
        "The student is already registered, or there is a prior request for this course.",
      );

    const enrollment = await EnrollmentModel.create({
      student_id: studentId,
      course_id: courseId,
      
      status: "pending",
      accepted_at: new Date(),
    });
    return enrollment;
  }

  static async updateStatus(
    enrollmentId: string,
    status: any,
    adminId: string,
  ): Promise<IEnrollment> {
    const enrollment = await EnrollmentModel.findById(enrollmentId);
    if (!enrollment) throw new Error("The enrollment record does not exist");

    enrollment.status = status;
    enrollment.accepted_by = adminId;
    if (status === "approved" && enrollment.status === "suspended") {
      enrollment.absence_count = 0;
    }
    await enrollment.save();
    return enrollment;
  }

  static async getEnrollments(filter: object = {}): Promise<IEnrollment[]> {
    return await EnrollmentModel.find(filter)
      .populate("student_id", "first_name last_name ")
      .populate("course_id", "title");
  }
  static async getStudentEnrollments(studentId: string): Promise<any[]> {
    const enrollments = await EnrollmentModel.find({ student_id: studentId })
      .populate({
        path: "course_id",
        select: "title duration_hours status teacher_id",
        populate: {
          path: "teacher_id",
          select: "first_name last_name email",
        },
      })
      .sort({ createdAt: -1 });

    return enrollments;
  }
  static async getStudentsByCourse(courseId: string): Promise<any[]> {
  const enrollments = await EnrollmentModel.find({ 
    course_id: courseId,
    status: "approved" 
  })
  .populate("student_id", "first_name last_name")
  .sort({ accepted_at: -1 });
  return enrollments;
}
}
