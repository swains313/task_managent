import TaskModel from "../model/Task";
import UserModel from "../model/User";

export class TaskService {

    createTask = async (data: any) => {
        if (data.assigned_to) {
            const user = await UserModel.findById(data.assigned_to);
            if (!user) {
                throw new Error("Assigned user does not exist");
            }
        }

        return await TaskModel.create(data);
    }

    getAllTasks = async (page: number = 1, limit: number = 10, sortby: string = "due_date", orderby: string = "DESC", filter: any = {}) => {
        const skip = (page - 1) * limit;
        const sortOrder = orderby.toUpperCase() === "DESC" ? -1 : 1;

        let filterQuery: any = {};
        if (filter.status) {
            filterQuery.status = filter.status;
        }
        if (filter.priority) {
            filterQuery.priority = filter.priority;
        }
        if (filter.due_date) {
            filterQuery.due_date = { $gte: new Date(filter.due_date) };
        }

        if(filter.assigned_to){
            filterQuery.assigned_to = filter.assigned_to
        }

        const tasks = await TaskModel.find(filterQuery)
            .skip(skip)
            .limit(limit)
            .sort({ [sortby]: sortOrder })
            .populate('assigned_to', 'email name') 
            .exec();

        return tasks;
    }

    getTaskById = async (_id: string) => {
        const task = await TaskModel.findById(_id).populate('assigned_to', 'email name');
        if (!task) {
            throw new Error("Task not found");
        }
        return task;
    }

    updateTaskById = async (_id: string, data: any) => {
        if (data.assigned_to) {
            const user = await UserModel.findById(data.assigned_to);
            if (!user) {
                throw new Error("Assigned user does not exist");
            }
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(_id, data, { new: true });
        if (!updatedTask) {
            throw new Error("Task not found");
        }
        return updatedTask;
    }

    deleteTaskById = async (_id: string) => {
        const task = await TaskModel.findByIdAndDelete(_id);
        if (!task) {
            throw new Error("Task not found");
        }
        return task;
    }

    assignTaskToUser = async (_id: string, userId: string) => {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(_id, { assigned_to: userId }, { new: true });
        if (!updatedTask) {
            throw new Error("Task not found");
        }
        return updatedTask;
    }
}
