import { Request, Response } from "express";
import { TaskService } from "../services/task.service";

export class TaskController {
    private taskService = new TaskService();

    createTask = async (req: Request, resp: Response) => {
        try {
            const task = await this.taskService.createTask(req.body);
            resp.status(201).json({ message: "Task created successfully", data: task });
        } catch (error: any) {
            resp.status(500).json({ message: "Error occurred while creating task", error: error.message });
        }
    }

    getAllTasks = async (req: Request, resp: Response) => {
        try {
            const { page, limit, orderby, sortby, status, priority, due_date, decodedToken  }:any = req.query;
            const assigned_to = null
            const filter = { status, priority, due_date , assigned_to };
            if(decodedToken && decodedToken.role === "user"){
                filter.assigned_to = decodedToken._id
            }
            
            const tasks = await this.taskService.getAllTasks(
                parseInt(page as string, 10) || 1,
                parseInt(limit as string, 10) || 10,
                sortby as string || "due_date",
                orderby as string || "ASC",
                filter
            );
            resp.status(200).json({ message: "Tasks fetched successfully", data: tasks });
        } catch (error: any) {
            resp.status(500).json({ message: "Error occurred while fetching tasks", error: error.message });
        }
    }

    getTaskById = async (req: Request, resp: Response) => {
        try {
            const task = await this.taskService.getTaskById(req.params._id);
            if (!task) {
                resp.status(404).json({ message: "Task not found" });
            } else {
                resp.status(200).json({ message: "Task fetched successfully", data: task });
            }
        } catch (error: any) {
            resp.status(500).json({ message: "Error occurred while fetching task", error: error.message });
        }
    }

    updateTaskById = async (req: Request, resp: Response) => {
        try {
            const updatedTask = await this.taskService.updateTaskById(req.params._id, req.body);
            if (!updatedTask) {
                resp.status(404).json({ message: "Task not found" });
            } else {
                resp.status(200).json({ message: "Task updated successfully", data: updatedTask });
            }
        } catch (error: any) {
            resp.status(400).json({ message: "Error occurred while updating task", error: error.message });
        }
    }

    deleteTaskById = async (req: Request, resp: Response) => {
        try {
            const deletedTask = await this.taskService.deleteTaskById(req.params._id);
            if (!deletedTask) {
                resp.status(404).json({ message: "Task not found" });
            } else {
                resp.status(200).json({ message: "Task deleted successfully" });
            }
        } catch (error: any) {
            resp.status(500).json({ message: "Error occurred while deleting task", error: error.message });
        }
    }

    assignTaskToUser = async (req: Request, resp: Response) => {
        try {
            const updatedTask = await this.taskService.assignTaskToUser(req.params._id, req.body.userId);
            if (!updatedTask) {
                resp.status(404).json({ message: "Task not found" });
            } else {
                resp.status(200).json({ message: "Task assigned to user successfully", data: updatedTask });
            }
        } catch (error: any) {
            resp.status(500).json({ message: "Error occurred while assigning task", error: error.message });
        }
    }
}
