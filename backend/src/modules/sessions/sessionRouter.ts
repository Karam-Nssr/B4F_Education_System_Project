import { Router } from "express";
import { SessionController } from "./sessionController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = Router();
router.post(
  "/courses/:courseId/sessions",
  authenticate,
  authorize(["admin", "teacher"]),
  SessionController.addSession,
);
router.get("/courses/:courseId/sessions", SessionController.getSessions);
export default router;
