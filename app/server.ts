import express from "express";
import { config } from "./config/env";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import authRoutes from "./modules/auth/route";
import taskRoutes from "./modules/task/route";
import { errorHandler } from "./middleware/errorMiddleware";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Task Manager API" });
});

app.listen(config.PORT, () =>
  console.log(`🚀 Server running on port ${config.PORT}`)
);
