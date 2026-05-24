import { Router } from "express";
import { createChat, delteChatById, getAllChats, getChatById } from "./chat.controller";

const ChatRouter = Router()

ChatRouter.get('/', getAllChats)
ChatRouter.get('/:chatId', getChatById)
ChatRouter.post('/', createChat)
ChatRouter.delete('/:chatId', delteChatById)

export default ChatRouter;
