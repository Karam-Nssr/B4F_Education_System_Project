import type { Request, Response } from "express";
import { AttendanceService } from "./attendanceRecordService.js";

export class AttendanceController {
  static async markAttendance(req: Request, res: Response) {
    try {
      const data = req.body;
      const currentUser = (req as any).user;
      const record = await AttendanceService.recordAttendance(data,currentUser);
      return res.status(200).json({ success: true, data: record });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getBySession(req: Request, res: Response) {
    try {
      const { sessionId } = (req as any).params;
      const records = await AttendanceService.getSessionAttendance(sessionId);
      return res.status(200).json({ success: true, data: records });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}