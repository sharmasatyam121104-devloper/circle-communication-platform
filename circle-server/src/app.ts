import express, { urlencoded } from "express";
const app = express();



import cors from "cors";
import corsOptions from "./config/cors.config";

app.use(express.json());
app.use(urlencoded({extended: false}));
app.use(cors(corsOptions))
app.use(cookieParser())
app.use("/profile-picture", express.static("src/uploads/profile-picture"));


import UserRouter from "./modules/user/user.routes";
import cookieParser from "cookie-parser";
app.use('/user', UserRouter)


app.get("/test", (req, res) => {
  res.send("Server Running...");
});

export default app;