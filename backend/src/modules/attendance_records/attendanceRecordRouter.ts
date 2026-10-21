import { Router } from "express";
import { AttendanceController } from "./attendanceRecordController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = Router();

router.post("/", authenticate, authorize(["admin","teacher"]), AttendanceController.markAttendance);
router.get("/session/:sessionId", AttendanceController.getBySession);

export default router;