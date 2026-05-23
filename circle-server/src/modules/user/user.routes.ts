import { Router } from "express";
import { getMe, login, logout, profile_picture, refreshToken, signup } from "./user.controller";
import { AuthMiddleware } from "./user.middleware";
import upload from "../../config/multer.config";


const UserRouter = Router()


UserRouter.post('/login', login)
UserRouter.post('/signup', signup)
UserRouter.get('/logout', AuthMiddleware, logout)
UserRouter.put('/profile-picture', AuthMiddleware, upload.single("profilePicture"), profile_picture)
UserRouter.get('/refresh-token', refreshToken)
UserRouter.get('/get-me', AuthMiddleware, getMe)


export default UserRouter;