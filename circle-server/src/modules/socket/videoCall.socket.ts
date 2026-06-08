import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const VideoCallSocket = (io: Server)=>{
    try {
        io.on("connection", async(socket)=>{
            console.log("🔌 user connected:", socket.id);
            const cookie = socket.handshake.headers.cookie;

            const access_token = cookie
                ?.split("; ")
                .find((row) => row.startsWith("access_token="))
                ?.split("=")[1];

            if (!access_token) {
                socket.disconnect();
                return;
            }

            const decoded = jwt.verify(
                access_token,
                process.env.ACCESS_SECRET!
            ) as { id: string };

            socket.data.userId = decoded.id;
            socket.join(socket.data.userId);

            socket.on("join-room", (roomId) => {
                socket.join(roomId);
                console.log("joined room:", roomId);
            });

            
            socket.on("send-offer", ({ offer, roomId, to, callerName }) => {
                socket.to(roomId).emit("accept-offer", {
                    offer,
                    from: socket.data.userId,
                    callerName
                });
            });

            socket.on("send-candidate", ({candidate, roomId})=>{
                socket.to(roomId).emit("accept-candidate",{
                    candidate,
                    from: socket.data.userId, 
                })              
            });

            socket.on("send-answer", ({answer, roomId})=>{
                socket.to(roomId).emit("accept-answer",{
                    answer,
                    from: socket.data.userId
                })
            })
        })
    } 
    catch (error) {
        console.error("Socket Registration Error:", error);
    }
}

export default VideoCallSocket