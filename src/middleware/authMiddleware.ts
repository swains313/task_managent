import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'

export const authMiddleware = (role?:string): void | any =>{

    return async (req:Request, res: Response, next: NextFunction)=>{
        try {
            const authHeader = req.headers['authorization'];
            const secret = process.env.JWT_SECRET
           
            if(!secret || !authHeader){
               return res.status(401).json({message: "Authorization failed"})
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Token is missing" });
            }
                const decode =await jwt.verify(token, secret)
                req.query.decodedToken = decode
                next()
        } catch (error) {
            res.status(401).json({message: "Unauthorized"})
        }
    }
}