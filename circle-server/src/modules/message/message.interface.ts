import { Types } from "mongoose";

interface AttachmentInterface {
    url: string;
    type: string;
    fileName: string;
    fileSize: number;
}

export interface MessageInterface {
    chat: Types.ObjectId;
    sender: Types.ObjectId;
    text: string;
    attachment?: AttachmentInterface;
    status: "sent" | "delivered" | "read"
}