import { Server } from "socket.io";
import server from "./app";
import corsOptions from "./config/cors.config";
import MessageSocket from "./modules/socket/message.socket";
import OnlineUserSocket from "./modules/socket/onlineUser.socket";
import VideoCallSocket from "./modules/socket/videoCall.socket";


const io = new Server(server, { cors: corsOptions})

OnlineUserSocket(io)
MessageSocket(io)
VideoCallSocket(io)

export default io;