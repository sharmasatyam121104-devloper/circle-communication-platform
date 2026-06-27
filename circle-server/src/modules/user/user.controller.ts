import { Request, Response } from "express";

import bcrypt from "bcrypt"
import crypto from "crypto"
import fs from 'fs'
import path from "path";
import sharp from "sharp";

import UserModel from "./user.model";
import { catchError, tryError } from "../../utils/serverErrorHandler";
import { generateAccessToken } from "../../utils/jwt";
import { SessionInterface } from "./user.interface";
import cloudinary from "../../config/cloudinary.config";
import { setAccessAndRefreshToken } from "./utils/cookies.utils";

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

        return res.status(201).json({message: "User registered successfully."})
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
        const refresh_token_hash = crypto.createHash("sha256").update(refresh_token).digest("hex");

        const last_login = Date.now()

        setAccessAndRefreshToken(res, access_token, refresh_token);

        await UserModel.findOneAndUpdate({_id: isUserExists._id}, {last_login, refresh_token: refresh_token_hash},{ returnDocument: "after"}) 

        return res.status(200).json({message: "User login sucessfully"})

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

        await UserModel.findByIdAndUpdate(id, {refresh_token: ""}, { returnDocument: "after" })

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



export const profile_picture = async (req: SessionInterface,res: Response) => {
  try {
    const id = req.id?.toString();

    if (!id) {
      throw tryError("Id not found.", 404);
    }

    if (!req.file) {
      throw tryError("Image is required", 400);
    }

    const uploadDir = "src/uploads/profile-picture";

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true,
      });
    }

    const fileName = `${id}.webp`;

    const outputPath = path.join(
      uploadDir,
      fileName
    );

    // Compress image
    await sharp(req.file.path)
      .resize(300, 300)
      .webp({
        quality: 70,
      })
      .toFile(outputPath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      outputPath,
      {
        folder: "circle/profile-picture",
        public_id: id,
        overwrite: true,
        resource_type: "image",
      }
    );

    // Save Cloudinary URL in DB
    await UserModel.findByIdAndUpdate(
      id,
      {
        profile_picture_url:
          result.secure_url,
      }
    );

    // Delete local files
    if (
      req.file.path &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    if (
      fs.existsSync(outputPath)
    ) {
      fs.unlinkSync(outputPath);
    }

    return res.status(200).json({
      message:
        "Profile image updated successfully.",
      profile_picture_url:
        result.secure_url,
    });

  } catch (error) {
    return catchError(
      error,
      res,
      "Error in profile_picture, Please try after sometime."
    );
  }
};

export const refreshToken = async(req: Request, res: Response)=>{
    try {
        let refresh_token = req.cookies?.refresh_token
        if(!refresh_token){
            throw tryError("Refresh token expired.", 400)
        }

        let refresh_token_hash = crypto.createHash("sha256").update(refresh_token).digest("hex");

        const user = await UserModel.findOne({refresh_token: refresh_token_hash})

        if(!user){
            throw tryError("Unauthorized Access", 401)
        }

        const access_token =  generateAccessToken(user._id)
        refresh_token =  crypto.randomBytes(64).toString("hex")
        refresh_token_hash = crypto.createHash("sha256").update(refresh_token).digest("hex");

        setAccessAndRefreshToken(res, access_token, refresh_token);

        await UserModel.findByIdAndUpdate(user._id, {refresh_token: refresh_token_hash})
        return res.status(200).json({message: "Access token generated successfully."})

    } 
    catch (error) {
        return catchError(error, res, "Error in refreshToken, Please try some time later.")    
    }
}

export const getMe = async(req: SessionInterface, res: Response)=>{
    try {
        const id = req.id?.toString()
        if(!id){
            throw tryError("Id not found.", 404)
        }
        const user = await UserModel.findById(id).select("-refresh_token")

        return res.status(200).json({data: user})
    } 
    catch (error) {
        return catchError(error, res, "Error in refreshToken, Please try some time later.")    
    }
}



export const googleCallback = async (req: any, res: any) => {
    try {
        const googleUser = req.user;

        // 1. check user in DB
        let user = await UserModel.findOne({
            email: googleUser.email,
        });

        // 2. if not exist → create user
        if (!user) {
            user = await UserModel.create({
            fullname: googleUser.fullname,
            email: googleUser.email,
            profile_picture_url: googleUser.avatar,
            provider: "google",
            });
        }

        const access_token =  generateAccessToken(user._id)
        const refresh_token =  crypto.randomBytes(64).toString("hex")
        const refresh_token_hash = crypto.createHash("sha256").update(refresh_token).digest("hex");

        user.last_login = new Date();
        user.refresh_token = refresh_token_hash;
        await user.save();

        setAccessAndRefreshToken(res, access_token, refresh_token);

        return res.redirect(`${process.env.CLIENT_URL}/chat`);
    } 
    catch (error) {
        catchError(error, res, "Error in Google login.")
        return res.redirect(`${process.env.CLIENT_URL}/login`);
    }
};


