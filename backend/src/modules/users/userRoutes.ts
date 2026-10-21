import { Router } from "express";
import { UserController } from "./userController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = Router();


router.get("/profile", authenticate, UserController.getUserProfile);
router.patch("/profile", authenticate, UserController.updateMyProfile);

router.get("/", authenticate, authorize(["admin"]), UserController.getAll);
router.post("/", authenticate, authorize(["admin"]), UserController.create);
router.get("/:id", authenticate, authorize(["admin"]), UserController.getUserProfile);
router.patch("/:id", authenticate, authorize(["admin"]), UserController.update);
router.patch("/:id/deactivate", authenticate, authorize(["admin"]), UserController.updateStatus);

export default router;