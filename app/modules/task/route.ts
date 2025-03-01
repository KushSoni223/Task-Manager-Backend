import express from "express";
import { TaskController } from "./controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();
const taskController = new TaskController();

router.post("/", authMiddleware, (req, res) =>
  taskController.createTask(req, res)
);
router.get("/", authMiddleware, (req, res) =>
  taskController.getTasksByUser(req, res)
);
router.get(
  "/:id",
  authMiddleware,
  taskController.getTaskById.bind(taskController)
);

router.put("/:id", authMiddleware, (req, res) =>
  taskController.updateTask(req, res)
);
router.delete("/:id", authMiddleware, (req, res) =>
  taskController.deleteTask(req, res)
);

export default router;
