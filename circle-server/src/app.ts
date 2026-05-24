import express, { urlencoded } from "express";
const app = express();



import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import corsOptions from "./config/cors.config";
import logger from "./utils/logger";

app.use(express.json());
app.use(urlencoded({extended: false}));
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(helmet())
app.use(logger);
app.use("/profile-picture", express.static("src/uploads/profile-picture"));


import UserRouter from "./modules/user/user.routes";
app.use('/user', UserRouter)


app.get("/test", (req, res) => {
  res.send("Server Running...");
});

export default app;