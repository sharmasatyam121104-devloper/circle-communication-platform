import {Response } from "express";
import { catchError, tryError } from "../../utils/serverErrorHandler";
import { SessionInterface } from "../user/user.interface";
import ChatModel from "../chat/chat.model";
import MessageModel from "./messsage.model";
import fs from "fs";
import cloudinary from "../../config/cloudinary.config";

type UploadAttachmentParams = {
  filePath: string;
  userId: string;
  mimetype: string;
};

const uploadAttachmentService = async ({filePath,userId,mimetype}: UploadAttachmentParams) => {

  try {

    const isDocument =
      mimetype.includes("pdf") ||
      mimetype.includes("doc") ||
      mimetype.includes("docx") ||
      mimetype.includes("text");

    const result =
      await cloudinary.uploader.upload(
        filePath,
        {
            folder: "attachments",

            public_id:
            `${userId}-${Date.now()}`,

            resource_type: isDocument
            ? "raw"
            : "auto",
        }
      );

    fs.unlinkSync(filePath);

    return {

      url: result.secure_url,

      public_id: result.public_id,

      resource_type: result.resource_type,
    };

  } catch (error) {

    if (fs.existsSync(filePath)) {

      fs.unlinkSync(filePath);
    }

    throw error;
  }
};


export  const sendMessage = async(req: SessionInterface, res: Response)=>{
    try {
        const id = req.id
        if(!id){
            throw tryError("User ID is required", 400)
        }

        const file = req.file;

        let attachment = null;

        const { chatId, text } = req.body;

        if(!chatId){
            throw tryError("Chat id is required.", 400)
        }

        if (!text && !file) {
            throw tryError("Message or attachment required.",400);
        }

        const chat = await ChatModel.findById(chatId)

        if (!chat) {
            throw tryError("Chat not found.", 404);
        }

        const participantsIdAvilableInChat = chat.participants.find((item: any)=>(
            item.toString() === id?.toString()
        ))

        if(!participantsIdAvilableInChat){
            throw tryError("You are not a valid user to access this chat", 401)
        }

        if(file){
            const uploadedFile =
            await uploadAttachmentService({
                filePath: file.path,
                userId: req.id!,
                mimetype: file.mimetype,
            });

            const fileType =
            file.mimetype.split("/")[0];

            attachment = {

            url: uploadedFile.url,

            type:
                fileType === "application"
                    ? "file"
                    : fileType,

                fileName: file.originalname,
                fileSize: file.size,
            };
        }

        const message = await  MessageModel.create({chat: chatId, sender: id, text, attachment})

        chat.lastMessage = message._id;
        await chat.save();

        return res.status(201).json({data: message})
    } 
    catch (error) {
        return catchError(error, res, "Error in sending message. Please try again later.")    
    }
}


export  const getMessagesByChatId = async(req: SessionInterface, res: Response)=>{
    try {
        const id = req.id;
        const chatId = req.params.chatId;

        if(!chatId){
            throw tryError("Chat id is required.", 400)
        }

        const chat = await ChatModel.findById(chatId)

        if (!chat) {
            throw tryError("Chat not found.", 404);
        }

        const participantsIdAvilableInChat = chat.participants.find((item: any)=>(
            item.toString() === id?.toString()
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
            item.toString() === id?.toString()
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