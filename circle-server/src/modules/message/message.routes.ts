import { Router } from "express";
import uploadAttachment from "./multer/attachment.multer";
import { deletMessageById, getMessagesByChatId, sendMessage } from "./message.controller";

const MessageRoouter = Router()

MessageRoouter.post('/', uploadAttachment.single("attachment"), sendMessage)
MessageRoouter.get('/:chatId', getMessagesByChatId)
MessageRoouter.delete("/:messageId", deletMessageById)

export default MessageRoouter;