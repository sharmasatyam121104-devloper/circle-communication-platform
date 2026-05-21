import { Request, Response } from "express";
import { catchError, tryError } from "../../utils/serverErrorHandler";
import UserModel from "./user.model";
import bcrypt from "bcrypt"
import { generateAccessToken } from "../../utils/jwt";
import crypto from "crypto"
import { SessionInterface } from "./user.interface";

export const signup = async(req: Request, res: Response)=>{
    try {
        const { fullname, email, password } = req.body;
        if(!fullname || !email || !password){
            throw tryError("All fields are required.",400);
        };

        const userExists = await UserModel.exists({email})
        if(userExists){
            throw tryError("Email already register", 400)
        }

        const userPayload = {
            fullname,
            email,
            password
        }

        const user = await UserModel.create(userPayload)

        return res.status(201).json({message: "User registerd sucessfully."})
    } 
    catch (error) {
        return catchError(error, res, "Error in singnup, Please try after sometime.");
    }
}


export const login = async(req: Request, res: Response)=>{
    try {
        const { email, password } = req.body;
        if(!email || !password){
            throw tryError("All fields are required.",400);
        };

        const isUserExists = await UserModel.findOne({email}).select("+password")
        if(!isUserExists){
            throw tryError("User not found", 404);
        }

        const userSavePassword = isUserExists.password
        const isPasswordSame = await bcrypt.compare(password, userSavePassword)
        if(!isPasswordSame){
            throw tryError("Invalid credentials", 401);
        }

        const access_token =  generateAccessToken(isUserExists._id)
        const refresh_token =  crypto.randomBytes(64).toString("hex")
        const hashRefreshToken = await bcrypt.hash(refresh_token, 10)
        const last_login = Date.now()

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "dev" || "development" ? false : true,
            sameSite: "lax",
            maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES)
        })

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "dev" || "development" ? false : true,
            sameSite: "lax",
            maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES)
        })

        const user = await UserModel.findOneAndUpdate({_id: isUserExists._id}, {last_login, refresh_token: hashRefreshToken},{new: true}) 

        return res.status(200).json({message: "User login sucessfully", data: user})

    } 
    catch (error) {
        return catchError(error, res, "Error in Login, Please try after sometime.")
    }
}


export const logout = async(req: SessionInterface, res: Response)=>{
    try {

        const id = req.id?.toString()

        if(!id){
            throw tryError("Id not found.", 404)
        }

        const user = await UserModel.findByIdAndUpdate({_id: id}, {refresh_token: ""}, {new: true})

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } 
    catch (error) {
        return catchError(error, res, "Error in logout, Please try after sometime.")
    }
}


export const profile_picture = async(req: Request, res: Response)=>{
    try {
        
    } 
    catch (error) {
        return catchError(error, res, "Error in profile_picture, Please try after sometime.")
    }
}


