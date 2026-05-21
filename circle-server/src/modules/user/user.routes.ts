import { Router } from "express";
import { login, logout, profile_picture, signup } from "./user.controller";


const UserRouter = Router()


UserRouter.post('/login', login)
UserRouter.post('/signup', signup)
UserRouter.get('/logout', logout)
UserRouter.post('/profile-picture', profile_picture)


export default UserRouter;