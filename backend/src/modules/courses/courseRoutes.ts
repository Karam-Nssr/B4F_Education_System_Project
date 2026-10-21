import { Router } from "express";
import { CourseController } from "./courseController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = Router();

router.post("/", authenticate, authorize(["admin"]), CourseController.create);
router.get("/", authenticate, CourseController.getAll);
router.get("/:id", authenticate, CourseController.getCourseById);
router.patch(
  "/:id",
  authenticate,
  authorize(["admin"]),
  CourseController.updateCourse,
);
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  CourseController.draftCourse,
);
export default router;
