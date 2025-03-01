import { Request, Response } from "express";
import { TaskService } from "./service";
import { AuthRequest } from "../../middleware/authMiddleware";

const taskService = new TaskService();

export class TaskController {
  async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;
      const userId = req.user?.id;

      if (!userId || !title) {
        res
          .status(400)
          .json({ success: false, message: "User ID and title are required" });
        return;
      }

      const task = await taskService.createTask(userId, title, description);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error creating task" });
    }
  }

  async getTasksByUser(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id ?? "";

      const tasks = await taskService.getUserTasks(userId);

      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching tasks" });
    }
  }
  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id; // Ensure user exists
      const { id: taskId } = req.params;

      console.log("dksnklhlgkah", taskId, userId);

      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const task = await taskService.getTask(userId, taskId);
      if (!task) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
      }

      res.status(200).json({ success: true, data: task });
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ success: false, message: "Error fetching task" });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedTask = await taskService.updateTask(id, req.body);
      if (!updatedTask) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
      }
      res.json({ success: true, data: updatedTask });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error updating task" });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedTask = await taskService.deleteTask(id);
      if (!deletedTask) {
        res.status(404).json({ success: false, message: "Task not found" });
        return;
      }
      res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error deleting task" });
    }
  }
}
