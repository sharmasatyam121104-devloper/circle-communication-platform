import { Server } from "socket.io";
import MessageModel from "../message/messsage.model";
import ChatModel from "../chat/chat.model";
import jwt from "jsonwebtoken"

const MessageSocket = (io: Server)=>{
    try {
        io.on("connection", (socket)=>{
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
            try {
                socket.on("join-chat", (chatId: string)=>{
                    socket.join(chatId)
                })

                socket.on("leave-chat", (chatId: string)=>{
                    socket.leave(chatId);
                })

                socket.on("send-message", async(message: any)=>{
                    io.to(message.chat).emit("recive-message", message);

                    const chat = await ChatModel.findById(message.chat);

                    if (!chat) return;

                    const receiverId = chat.participants.find(
                        (id: string) => id.toString() !== socket.data.userId
                    );

                    if (!receiverId) return;

                    io.to(receiverId.toString()).emit("msg-notification", {
                        senderId: socket.data.userId,
                        message,
                    });

                })

                socket.on("message-delivered", async ({ messageId, chatId }) => {
                    try {
                        const userId = socket.data.userId;

                        const chat = await ChatModel.findById(chatId);

                        if (!chat) return;

                        const isParticipant = chat.participants.some(
                            (id: string) => id.toString() === userId
                        );

                        if (!isParticipant) return;

                        const message = await MessageModel.findById(messageId);

                        if (!message) return;

                        if (message.chat.toString() !== chatId) return;

                        if (
                            message.status === "delivered" ||
                            message.status === "read"
                        ) {
                            return;
                        }

                        const updatedMessage = await MessageModel.findByIdAndUpdate(
                            messageId,
                            { status: "delivered" },
                            { new: true }
                        );

                        io.to(chatId).emit(
                            "message-status-update",
                            updatedMessage
                        );
                    } 
                    catch (error) {
                        console.error(error);
                    }
                });

                socket.on("messages-read", async ({ chatId }) => {
                    try {
                        const userId = socket.data.userId;

                        const chat = await ChatModel.findById(chatId);

                        if (!chat) {
                            console.log("Chat not found");
                            return;
                        }

                        const isParticipant = chat.participants.some(
                            (id: string) => id.toString() === userId
                        );

                        if (!isParticipant) {
                            console.log("User is not a participant of this chat");
                            return;
                        }

                        const messages = await MessageModel.updateMany(
                            {
                                chat: chatId,
                                sender: { $ne: userId },
                                status: { $ne: "read" }
                            },
                            {
                                status: "read"
                            }
                        );

                        console.log("EMITTING messages-read", chatId);

                        io.to(chatId).emit("messages-read", {
                            chatId,
                        });
                    } 
                    catch (error) {
                        console.error("Error marking messages as read:", error);
                    }
                });
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