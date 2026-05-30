import express, { urlencoded } from "express";
const app = express();

import { createServer } from "node:http";
const server = createServer(app)



import cors from "cors";
import helmetConfig from "./config/helmet.config";
import cookieParser from "cookie-parser";
import passport from "passport";
import corsOptions from "./config/cors.config";
import logger from "./utils/logger";

app.use(cors(corsOptions))
app.use(express.json());
app.use(urlencoded({extended: false}));
app.use(cookieParser())
app.use(helmetConfig);
app.use(logger);
app.use(passport.initialize());
app.use("/profile-picture", express.static("src/uploads/profile-picture"));

import "./config/passport.config";


import UserRouter from "./modules/user/user.routes";
import ChatRouter from "./modules/chat/chat.routes";
import MessageRoouter from "./modules/message/message.routes";
import { AuthMiddleware } from "./modules/user/user.middleware";

app.use('/user', UserRouter)
app.use('/chat', AuthMiddleware, ChatRouter)
app.use('/message', AuthMiddleware, MessageRoouter)


app.get("/test", (req, res) => {
  res.send("Server Running...");
});

export default server;