import { Request, Response } from "express";
import { catchError } from "../../utils/serverErrorHandler";

export const signup = async(req: Request, res: Response)=>{
    try {
        
    } 
    catch (error) {
        return catchError(error, res, "Error in singnup, Please try after sometime.")
    }
}


export const login = async(req: Request, res: Response)=>{
    try {
        
    } 
    catch (error) {
        return catchError(error, res, "Error in Login, Please try after sometime.")
    }
}


export const logout = async(req: Request, res: Response)=>{
    try {
        
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


