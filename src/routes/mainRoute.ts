import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { TaskController } from "../controllers/task.controller";


export class MainRouter{

    static userController = new UserController()
    static taskController = new TaskController()


    
    static register(){
        const router = Router()
        router.route("/login").post(this.userController.login)
        router.route("/user").post(authMiddleware(), this.userController.createUser)
        router.route("/user").get(authMiddleware(),this.userController.getAllUsers)
        router.route("/user/:_id").get(authMiddleware(),this.userController.getUserById)
        router.route("/user/:_id").put(authMiddleware(),this.userController.updateUserById)
        router.route("/user/:_id").delete(authMiddleware(),this.userController.deleteUserById)



        router.route("/task").post(authMiddleware(),this.taskController.createTask)
        router.route("/task").get(authMiddleware(),this.taskController.getAllTasks)
        router.route("/task/:_id").get(authMiddleware(),this.taskController.getTaskById)
        router.route("/task/:_id").put(authMiddleware(),this.taskController.updateTaskById)
        router.route("/task/:_id").delete(authMiddleware(),this.taskController.deleteTaskById)





        return router
    }
}