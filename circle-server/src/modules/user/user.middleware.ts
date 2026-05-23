import { NextFunction, Request, Response } from "express";
import { catchError, tryError } from "../../utils/serverErrorHandler";
import jwt  from "jsonwebtoken";
import { SessionInterface } from "./user.interface";
import UserModel from "./user.model";


export const AuthMiddleware = async(req: SessionInterface, res: Response, next: NextFunction)=>{
    try {

        const token = req.cookies?.access_token;

        if (!token) {
            throw tryError("Unauthorized: No token provided", 401);
        }

        const decoded = jwt.verify(token,  process.env.ACCESS_SECRET!) as { id: string };
        req.id = decoded?.id ;

        const user = await UserModel.exists({_id: req?.id})

        if(!user){
            throw tryError("You are not authorized to access this resource.", 401)
        }

        next()

    } catch (error) {
        return catchError(error, res)
    }
}