import { model, models, Schema, Types } from "mongoose";
import { ChatInterface } from "./chat.interface";

const chatSchema = new Schema<ChatInterface>({
    participants: [{
        type: Types.ObjectId,
        ref: "User",
        required: true
    }],
    lastMessage: {
        type: Types.ObjectId,
        ref: "Message"
    }
},
{timestamps: true})

const ChatModel = models.Chat || model<ChatInterface>("Chat", chatSchema)

export default ChatModel