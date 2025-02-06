import { comparePassword } from "../helper/bcryptHelper";
import { generateToken } from "../helper/jsonTokenHelper";
import UserModel from "../model/User";
import bcryptjs from 'bcryptjs'

export class UserService {

    createUser = async (data: any) => {
        const user = await (await UserModel.findOne({ email: data.email }))
        if (user) {
            throw new Error("User already exist with email " + data.email)
        }

        data.password = await bcryptjs.hash(data.password, 10)
        return await UserModel.create(data)
    }

    getAllUser = async (page: number = 1, limit: number = 10, orderby: string = "DESC") => {
        const skip = (page - 1) * limit;
        const sortOrder = orderby.toUpperCase() === 'DESC' ? -1 : 1;

        const users = await UserModel.find({ role: { $ne: 'admin' } })
            .skip(skip)
            .limit(limit)
            .select('-password')
            .sort({ _id: sortOrder });
        return users
    }

    getUserById = async (_id: string) => {
        console.log("Calling findById with ID:", _id);
        const user = await UserModel.findById(_id)
        console.log(user);
        if (!user) {
            throw new Error("User not found");
        }
        
        return user
    }

    updateUserById = async (_id: string, data: any) => {
        const updatedUser = await UserModel.findByIdAndUpdate(_id, data, { new: true })
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return updatedUser
    }

    deleteUserById = async (_id: string) => {
        const deletedUser = await UserModel.findByIdAndDelete(_id);
        if (!deletedUser) {
            throw new Error("User not found");
        }
        return deletedUser;
    }


    login = async (email: string, password: string) => {

        const user: any = await UserModel.findOne({ email: email })
        if (!user) {
            throw { status: 404, message: "User not found" };
        }
        const hashPassword = user.password
        const verifyPassword = await comparePassword(password, hashPassword)
        if (!verifyPassword) {
            throw { status: 401, message: "Invalid credentials" };
        }
        if (verifyPassword) {
            const token = await generateToken(user)
            return { user, token }
        }
    }
}