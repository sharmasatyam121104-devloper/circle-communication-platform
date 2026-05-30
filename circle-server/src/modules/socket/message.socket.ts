import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const MessageSocket = (io: Server)=>{
    try {
        io.on("connection", (socket)=>{
            try {
                socket.on("join-chat", (chatId: string)=>{
                    console.log("join-chat", chatId);
                    socket.join(chatId)
                })

                socket.on("leave-chat", (chatId: string)=>{
                    console.log("leave-chat", chatId);
                    socket.leave(chatId);
                })

                socket.on("send-message", (message: any)=>{
                    console.log("send-message data", message);
                    io.to(message.chat).emit("recive-message", message);
                })
            } 
            catch (error) {
                console.error("Socket Auth Error:", error);
                socket.disconnect();
            }
        })
    } catch (error) {
        console.error("Socket Message Error:", error);
    }
}

export default MessageSocket