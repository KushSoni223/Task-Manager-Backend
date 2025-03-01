import { TaskRepository } from "./repository";

const taskRepo = new TaskRepository();

export class TaskService {
  async createTask(userId: string, title: string, description?: string) {
    return await taskRepo.createTask({ userId, title, description });
  }

  async getUserTasks(userId: string) {
    return await taskRepo.getTasksByUser(userId);
  }

  async getTask(userId: string, taskId: string) {
    return await taskRepo.getTaskById(userId, taskId);
  }

  async updateTask(
    taskId: string,
    updateData: { title?: string; description?: string; completed?: boolean }
  ) {
    return await taskRepo.updateTask(taskId, updateData);
  }

  async deleteTask(taskId: string) {
    return await taskRepo.deleteTask(taskId);
  }
}
