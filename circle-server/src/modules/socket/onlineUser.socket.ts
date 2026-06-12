import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const onlineUsers = new Map<string, string>();

const OnlineUserSocket = (io: Server) => {
    try {
        io.on("connection", (socket) => {
            try {
                const cookie = socket.handshake.headers.cookie;

                const access_token = cookie
                    ?.split("; ")
                    .find((row) => row.startsWith("access_token="))
                    ?.split("=")[1];

                if (!access_token) {
                    socket.disconnect();
                    return;
                }

                const decoded = jwt.verify(access_token,process.env.ACCESS_SECRET!) as { id: string };

                const userId = decoded.id;

                onlineUsers.set(userId, socket.id);

                io.emit("online-users", [...onlineUsers.keys()]);

                socket.on("get-online-users", ()=>{
                    io.emit("online-users", [...onlineUsers.keys()]);
                })

                socket.on("disconnect", () => {
                    onlineUsers.delete(userId);

                    io.emit("online-users", [...onlineUsers.keys()]);
                });
            } 
            catch (error) {
                console.error("Socket Auth Error:", error);
                socket.disconnect();
            }
        });
    } 
    catch (error) {
        console.error("Socket Registration Error:", error);
    }
};

export default OnlineUserSocket;