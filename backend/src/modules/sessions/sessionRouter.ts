import { Router } from "express";
import { SessionController } from "./sessionController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = Router();
router.post("/:courseId/sessions", authenticate, authorize(["admin","teacher"]), SessionController.addSession);
router.get("/:courseId/sessions", SessionController.getSessions);
export default router;