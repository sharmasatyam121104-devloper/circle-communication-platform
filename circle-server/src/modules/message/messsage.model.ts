import { model, models, Schema, Types } from "mongoose";
import { MessageInterface } from "./message.interface";

const messageschema = new Schema<MessageInterface>({
    chat: {
        type: Types.ObjectId,
        ref: "Chat",
        required: true
    },
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    attachment: {
        url: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum:  ["image", "video", "file", "audio"],
            fileName: String,
            fileSize: Number,
        },
        status: {
            type: String,
            enum: ["sent", "delivered", "read"],
            default: "sent",
        }
    }
},
{timestamps: true}
)

const MessageModel = models.Messgae || model("Messgae", messageschema)

export default MessageModel;