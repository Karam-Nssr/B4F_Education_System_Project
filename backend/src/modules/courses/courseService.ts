import { CourseModel, type ICourse } from "./Course.js";

export class CourseService {
  static async createCourse(data: ICourse): Promise<ICourse> {
    return await CourseModel.create(data);
  }

  static async getAllCourses(): Promise<ICourse[]> {
    return await CourseModel.find().populate("teacher", "first_name last_name email");
  }

  static async getCourseById(id: string): Promise<ICourse | null> {
    return await CourseModel.findById(id).populate("teacher", "first_name last_name email");
  }
}