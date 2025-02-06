import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
    private userService = new UserService();

    login = async (req: Request, resp: Response):Promise<any> => {
        try {
            const {email, password} = req.body
            const user = await this.userService.login(email, password);
            resp.status(200).json({ message: "User login successfully", data: user });
        } catch (error:any) { 
            if (error.status === 404) {
                return resp.status(404).json({ message: "Invalid credentials" }); 
            } else if (error.status === 401) {
                return resp.status(401).json({ message: "Invalid credentials" }); 
            }           
            resp.status(500).json({ message: "Error occurred while login", error: error.message });
        }
    }

     createUser = async (req: Request, resp: Response) => {
        try {
            const user = await this.userService.createUser(req.body);
            resp.status(201).json({ message: "User created successfully", data: user });
        } catch (error:any) {            
            resp.status(500).json({ message: "Error occurred while creating user", error: error.message });
        }
    }

     getAllUsers = async(req: Request, resp: Response) => {
        try {
            const { page, limit, orderby } = req.query;
            const users = await this.userService.getAllUser(
                parseInt(page as string, 10) || 1,
                parseInt(limit as string, 10) || 10,
                orderby as string || "DESC"
            );
            resp.status(200).json({ message: "Users fetched successfully", data: users });
        } catch (error:any) {
            resp.status(500).json({ message: "Error occurred while fetching users", error: error.message });
        }
    }

     getUserById = async (req: Request, resp: Response) => {
        try {
            const user = await this.userService.getUserById(req.params._id);
            if (!user) {
                resp.status(404).json({ message: "User not found" });
            } else {
                resp.status(200).json({ message: "User fetched successfully", data: user });
            }
        } catch (error:any) {
            resp.status(500).json({ message: "Error occurred while fetching user", error: error.message });
        }
    }

     updateUserById =async(req: Request, resp: Response) => {
        try {
            const updatedUser = await this.userService.updateUserById(req.params._id, req.body);
            if (!updatedUser) {
                resp.status(404).json({ message: "User not found" });
            } else {
                resp.status(200).json({ message: "User updated successfully", data: updatedUser });
            }
        } catch (error:any) {
            resp.status(400).json({ message: "Error occurred while updating user", error: error.message });
        }
    }

     deleteUserById = async(req: Request, resp: Response)=> {
        try {
            const deletedUser = await this.userService.deleteUserById(req.params._id);
            if (!deletedUser) {
                resp.status(404).json({ message: "User not found" });
            } else {
                resp.status(200).json({ message: "User deleted successfully" });
            }
        } catch (error:any) {
            resp.status(500).json({ message: "Error occurred while deleting user", error: error.message });
        }
    }
}
