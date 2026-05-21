import { Router } from "express";
import { login, logout, profile_picture, signup } from "./user.controller";
import { AuthMiddleware } from "./user.middleware";


const UserRouter = Router()


UserRouter.post('/login', login)
UserRouter.post('/signup', signup)
UserRouter.get('/logout', AuthMiddleware, logout)
UserRouter.post('/profile-picture', AuthMiddleware, profile_picture)


export default UserRouter;