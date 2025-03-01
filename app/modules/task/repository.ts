import { Task } from "./model";

export class TaskRepository {
  async createTask(taskData: {
    title: string;
    description?: string;
    userId: string;
  }) {
    return await Task.create(taskData);
  }

  async getTasksByUser(userId: string) {
    return await Task.find({ userId });
  }

  async getTaskById(userId: string, taskId: string) {
    return await Task.findOne({ _id: taskId, userId: userId });
  }

  async updateTask(
    taskId: string,
    updateData: Partial<{
      title: string;
      description: string;
      completed: boolean;
    }>
  ) {
    return await Task.findByIdAndUpdate(taskId, updateData, { new: true });
  }

  async deleteTask(taskId: string) {
    return await Task.findByIdAndDelete(taskId);
  }
}
