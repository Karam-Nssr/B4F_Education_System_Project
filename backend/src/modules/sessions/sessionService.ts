import { SessionModel, type ISession } from "./Session.js";

export class SessionService {
  static async createSession(data: ISession): Promise<ISession> {
    return await SessionModel.create(data);
  }

  static async getCourseSessions(courseId: string): Promise<ISession[]> {
    return await SessionModel.find({ course: courseId }).sort({ session_date: 1 });
  }
}