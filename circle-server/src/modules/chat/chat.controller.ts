import {  Response } from "express";
import { catchError, tryError } from "../../utils/serverErrorHandler";
import { SessionInterface } from "../user/user.interface";
import ChatModel from "./chat.model";
import UserModel from "../user/user.model";

export const createChat = async(req: SessionInterface, res: Response)=>{
    try {
        const id = req.id?.toString();
        const {email} = req.body;
        if(!email){
            throw tryError("Email is required", 400)
        }

        const participantsUser = await UserModel.findOne({email})
        if(!participantsUser){
            throw tryError("User not avilable for this email id, Please enter correct email id", 404)
        }

        const participantsId = participantsUser?._id 

        if (!id || !participantsId) {
        throw tryError("Invalid participants", 400);
        }

        if (id === participantsId) {
            throw tryError("You cannot create chat with yourself", 400);
        }

        const existingChat = await ChatModel.findOne({
            participants: { $all: [id, participantsId] },
        });

        if(existingChat) {
            throw tryError("Chat already exists. Cannot create duplicate chat.", 409)
        }
        const chatPayload = {
            participants: [id, participantsId]
        }
        await ChatModel.create(chatPayload)

        return res.status(201).json({message: "Chat created successfully."})
    } 
    catch (error) {
        return catchError(error, res,  "Error in creating chat. Please try again later.")
    }
}

export const getAllChats = async(req: SessionInterface, res: Response)=>{
    try {
        const id = req.id?.toString();
        if (!id ) {
            throw tryError("userId required.", 400);
        }

        const allChats = await ChatModel.find({participants: id})
        .populate("lastMessage")
        .populate({
            path: "participants",
            select: "fullname email profile_picture_url",
        })
        .sort({ updatedAt: -1 });

        return res.status(200).json({data: allChats})
    } 
    catch (error) {
        return catchError(error, res, "Error in fetching chats. Please try again later.")
    }
}

export const getChatById = async(req: SessionInterface, res: Response)=>{
    try {
        const id = req.id?.toString();
        if (!id ) {
            throw tryError("userId required.", 400);
        }

        const {chatId} = req.params;
        if(!chatId){
            throw tryError("ChatId is required", 400)
        }

        const chat = await ChatModel.findById(chatId)
        return res.json({data: chat})
    } 
    catch (error) {
        return catchError(error, res, "Error in fetching chat by ID. Please try again later.")
    }
}

export const delteChatById = async(req: SessionInterface, res: Response)=>{
    try {
        const id = req.id?.toString();
        if (!id ) {
            throw tryError("userId required.", 400);
        }

        const {chatId} = req.params;
        if(!chatId){
            throw tryError("ChatId is required", 400)
        }

        const chat = await ChatModel.findByIdAndDelete(chatId)
        return res.json({message: "Chat delted successfully."})
    } 
    catch (error) {
        return catchError(error, res, "Error in deleting chat. Please try again later.")
    }
}

