import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/authRoutes.js";
import courseRoutes from "./modules/courses/courseRoutes.js";
import userRoutes from "./modules/users/userRoutes.js";
import sessionRoutes from "./modules/sessions/sessionRouter.js";
import enrollmentRoutes from "./modules/enrollments/enrollmentRoutes.js";
const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

app.use("/", authRoutes);
app.use("/courses", courseRoutes);
app.use("/", userRoutes);
app.use("/", sessionRoutes);
app.use("/", enrollmentRoutes);
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
