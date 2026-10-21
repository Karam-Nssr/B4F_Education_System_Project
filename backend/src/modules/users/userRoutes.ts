import { Router } from "express";
import { UserController } from "./userController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { authorize } from "../../middlewares/roleMiddleware.js";

const router = Router();

router.get("/users/profile", authenticate, UserController.getUserProfile);
router.patch("/users/profile", authenticate, UserController.updateMyProfile);

router.get("/users/", authenticate, authorize(["admin"]), UserController.getAll);
router.get(
  "/getAllTeachers",
  authenticate,
  authorize(["admin"]),
  UserController.getAllTeachers,
);
router.post("/users/", authenticate, authorize(["admin"]), UserController.create);
router.get(
  "/:id",
  authenticate,
  authorize(["admin"]),
  UserController.getUserProfile,
);
router.patch("/users/:id", authenticate, authorize(["admin"]), UserController.update);
router.patch(
  "/users/:id/deactivate",
  authenticate,
  authorize(["admin"]),
  UserController.updateStatus,
);

export default router;
