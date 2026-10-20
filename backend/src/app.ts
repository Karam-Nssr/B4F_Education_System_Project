import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/authRoutes.js";
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
}));

app.use("/", authRoutes);
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;