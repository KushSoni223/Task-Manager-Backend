import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./modules/auth/route";
import taskRoutes from "./modules/task/route";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Task Manager API" });
});

export default app;
