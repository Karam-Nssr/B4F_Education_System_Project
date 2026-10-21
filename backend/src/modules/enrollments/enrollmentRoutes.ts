import { Router } from "express";
import { EnrollmentController } from "./enrollmentController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = Router();
router.post(
  "/enrollments/",
  authenticate,
  authorize(["admin", "student"]),
  EnrollmentController.create,
);

router.get(
  "/enrollments/",
  authenticate,
  authorize(["admin"]),
  EnrollmentController.getAll,
);
router.get(
  "my-courses",
  authenticate,
  authorize(["student"]),
  EnrollmentController.getMyEnrollments,
);
router.get(
  "student/:studentId/courses",
  authenticate,
  authorize(["admin", "teacher"]),
  EnrollmentController.getMyEnrollments,
);
router.patch(
  "/:id/status",
  authenticate,
  authorize(["admin"]),
  EnrollmentController.updateStatus,
);
router.get(
  "course/:courseId/students",
  authenticate,
  authorize(["admin", "teacher"]),
  EnrollmentController.getCourseStudents,
);
export default router;
