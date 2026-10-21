import { Router } from "express";
import { CourseController } from "./courseController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = Router();

router.post("/", authenticate, authorize(["admin"]), CourseController.create);
router.get("/", CourseController.getAll);
export default router;
