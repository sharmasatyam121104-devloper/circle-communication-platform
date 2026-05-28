import { Request, Response } from "express";
import { catchError, tryError } from "../../utils/serverErrorHandler";
import { SessionInterface } from "../user/user.interface";
import ChatModel from "../chat/chat.model";
import MessageModel from "./messsage.model";

export  const sendMessage = async(req: Request, res: Response)=>{
    try {
        
    } 
    catch (error) {
        return catchError(error, res, "Error in sending message. Please try again later.")    
    }
}


export  const getMessages = async(req: SessionInterface, res: Response)=>{
    try {
        const id = req.id;
        const chatId = req.body.chatId;

        if(!chatId){
            throw tryError("Chat id is required.", 400)
        }

        const chat = await ChatModel.findById(chatId)

        if (!chat) {
            throw tryError("Chat not found.", 404);
        }

        const participantsIdAvilableInChat = chat.participants.find((item: any)=>(
            item._id.toString() === id?.toString()
        ))

        if(!participantsIdAvilableInChat){
            throw tryError("You are not a valid user to access this chat", 401)
        }

        const chatMesssages = await MessageModel.find({chat: chat._id})

        return res.status(200).json({message: "All messages fetched successfully.", chatMesssages})
        
    } 
    catch (error) {
        return catchError(error, res, "Error in fetching  message. Please try again later.")    
    }
}


export  const deletMessageById = async(req: SessionInterface, res: Response)=>{
    try {
        const id = req.id;
        const chatId = req.body.chatId;
        const messageId = req.params.messageId;

        if(!chatId){
            throw tryError("Chat id is required.", 400)
        }
        
        if(!messageId){
            throw tryError("Message id is required.", 400)
        }

        const chat = await ChatModel.findById(chatId)

        if (!chat) {
            throw tryError("Chat not found.", 404);
        }

        const participantsIdAvilableInChat = chat.participants.find((item: any)=>(
            item._id.toString() === id?.toString()
        ))
        
        if(!participantsIdAvilableInChat){
            throw tryError("You are not a valid user to access this chat", 401)
        }

        const message = await MessageModel.findById(messageId);

        if (!message) {
            throw tryError("Message not found.", 404);
        }

        if(message.chat.toString() !== chatId){
            throw tryError(
                "You are not a valid user to access this chat",
                401
            )
        }

        await MessageModel.findByIdAndDelete(messageId);

        return res.status(200).json({
            message: "Message deleted successfully",
        });
    } 
    catch (error) {
        return catchError(error, res, "Error in fetching  message. Please try again later.")    
    }
}