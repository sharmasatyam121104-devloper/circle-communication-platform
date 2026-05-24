import { Types } from "mongoose";

export interface ChatInterface {
    _id?: Types.ObjectId;
    participants: Types.ObjectId[];
    lastMessage: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}