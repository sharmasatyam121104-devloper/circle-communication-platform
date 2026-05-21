import express, { urlencoded } from "express";
const app = express();



import cors from "cors";
import corsOptions from "./config/cors.config";

app.use(express.json());
app.use(urlencoded({extended: false}));
app.use(cors(corsOptions))



import UserRouter from "./modules/user/user.routes";
app.use('/user', UserRouter)


app.get("/test", (req, res) => {
  res.send("Server Running...");
});

export default app;