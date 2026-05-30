import { Server } from "socket.io";
import server from "./app";
import corsOptions from "./config/cors.config";
import OnlineUser from "./modules/socket/onlineUser.socket";


const io = new Server(server, { cors: corsOptions})

OnlineUser(io)

export default io;