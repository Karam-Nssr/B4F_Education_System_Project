import { CourseModel, type ICourse } from "./Course.js";

export class CourseService {
  static async createCourse(data: ICourse): Promise<ICourse> {
    return await CourseModel.create(data);
  }

  static async getAllCourses(currentUser: {
    userId: string;
    role: string;
  }): Promise<ICourse[]> {
    let filter: any = {};
    console.log(currentUser);
    if (currentUser.role === "student") {
      filter.status = "active";
    } else if (currentUser.role === "teacher") {
      filter.teacher = currentUser.userId;
    } else if (currentUser.role === "admin") {
      filter = {};
    }

    return await CourseModel.find(filter).populate(
      "teacher",
      "first_name last_name email",
    );
  }

  static async getCourseById(id: string): Promise<ICourse | null> {
    return await CourseModel.findById(id).populate(
      "teacher",
      "first_name last_name email",
    );
  }
  static async updateCourse(
    id: string,
    updateData: Partial<ICourse>,
  ): Promise<ICourse> {
    const updatedCourse = await CourseModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("teacher", "first_name last_name email");

    if (!updatedCourse) {
      throw new Error("Course not found");
    }

    return updatedCourse;
  }
  static async deleteCourse(id: string): Promise<ICourse> {
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      id,
      { status: "draft" },
      { new: true, runValidators: true },
    ).populate("teacher", "first_name last_name email");

    if (!updatedCourse) {
      throw new Error("Course not found");
    }

    return updatedCourse;
  }
}
