import { Router } from "express";
import { getMe, googleCallback, login, logout, profile_picture, refreshToken, signup } from "./user.controller";
import { AuthMiddleware } from "./user.middleware";
import upload from "../../config/multer.config";
import passport from "passport";


const UserRouter = Router()


UserRouter.post('/login', login)
UserRouter.post('/signup', signup)
UserRouter.get('/logout', AuthMiddleware, logout)
UserRouter.put('/profile-picture', AuthMiddleware, upload.single("profilePicture"), profile_picture)
UserRouter.get('/refresh-token', refreshToken)
UserRouter.get('/get-me', AuthMiddleware, getMe)
UserRouter.get("/google", passport.authenticate("google", {scope: ["profile", "email"],}));
UserRouter.get("/google/callback", passport.authenticate("google", {session: false,}), googleCallback);


export default UserRouter;