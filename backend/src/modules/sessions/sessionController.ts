import type { Request, Response } from "express";
import { SessionService } from "./sessionService.js";
export class SessionController {
   static async addSession(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const session = await SessionService.createSession({ ...req.body, course: courseId });
      return res.status(201).json({ success: true, data: session });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getSessions(req: Request, res: Response) {
    try {
      const { courseId } = (req as any).params;
      const sessions = await SessionService.getCourseSessions(courseId);
      return res.status(200).json({ success: true, data: sessions });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
