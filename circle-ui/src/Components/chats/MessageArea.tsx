import { useEffect, useRef, useState } from "react"
import ReceiverMessage from "./ReciverMessage"
import SenderMessage from "./SenderMessage"
import clientCatchError from "../../lib/clientCatchError"
import api from "../../lib/api"
import useAuthStore from "../../store/useAuthStore"
import Loader from "../ui/Loder"
import socket from "../../lib/socketClient"

interface ParticipantInterface {
  _id: string;
  fullname: string;
  email: string;
  profile_picture_url: string;
}

type MessageAreaProps = {
    openChatId: string;
    openChatUser: ParticipantInterface | null
    addMessageInChat: MessageInterface | null 
    joinChat: boolean
    setJoinChat: React.Dispatch<React.SetStateAction<boolean>>
}

interface AttachmentInterface {
    url: string;
    type: string;
    fileName: string;
    fileSize: number;
}

export interface MessageInterface {
    chat: string;
    sender: string;
    text: string;
    attachment?: AttachmentInterface;
    status: "sent" | "delivered" | "read"
    updatedAt: string
}

const server = import.meta.env.VITE_SERVER;

const MessageArea = ({openChatId, openChatUser, addMessageInChat, joinChat, setJoinChat}: MessageAreaProps) => {

    const [allMessageOfChat, setAllMessgaeOfChat] = useState<MessageInterface[]>([])
    const [allMessageOfChatLoading, setAllMessgaeOfChatLoading] = useState(false)

    const user = useAuthStore((state)=>state.user)

    const bottomRef = useRef<HTMLDivElement | null>(null)

    const limit = 20;

    // scroll bottom
    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (!joinChat) return;

        const handler = (data:MessageInterface) => {
            setAllMessgaeOfChat((prev) => [...prev, data]);
        };

        socket.on("recive-message", handler);

        return () => {
            socket.off("recive-message", handler);
        };
    }, [joinChat]);

    useEffect(() => {
        scrollToBottom()
    }, [allMessageOfChat])

    useEffect(()=>{
        const getAllMessageOfChat = async()=>{
            try {
                if(!openChatId) return;

                setAllMessgaeOfChatLoading(true)
                const { data } = await api.get(
                `/message/${openChatId}?limit=${limit}`
                )
                setAllMessgaeOfChat(data.chatMessages.reverse())
            } 
            catch (error) {
                clientCatchError(error)
            }
            finally{
                setAllMessgaeOfChatLoading(false)
            }
        }

        getAllMessageOfChat()
    },[openChatId])

    useEffect(() => {

        if (!addMessageInChat) return;
        queueMicrotask(() => {

            setAllMessgaeOfChat((prev) => {
                if (!prev) {
                    return [addMessageInChat];
                }

                return [...prev, addMessageInChat];
            });
        });

    }, [addMessageInChat]);

    


    // useEffect for stablised connecopn
    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            if (openChatId) {
                socket.emit("join-chat", openChatId);
            }
        });

        return () => {
            socket.off("connect");
            socket.disconnect();
            setJoinChat(false)
        };
    }, []);

    useEffect(() => {
        if (!openChatId) return;

        const join = () => {
            socket.emit("join-chat", openChatId);
            setJoinChat(true)
        }

        if (socket.connected) {
            join();
        } else {
            socket.once("connect", join);
        }

        return () => {
            socket.emit("leave-chat", openChatId);
            setJoinChat(false)
        };
    }, [openChatId]);

    if(allMessageOfChatLoading){
        return (
            <div className="flex justify-center items-center h-full w-full">
                <Loader size="lg"/>
            </div>
        )
    }
   
    return (
        <div className="lg:h-140 h-[80vh] overflow-y-auto" >
            {
                allMessageOfChat?.map((item: MessageInterface, index: number)=>{
                    return (
                        <div key={index}>
                            {
                                item.sender === user?.data._id ? 
                                <ReceiverMessage
                                    message={item.text}
                                    time={new Date(item.updatedAt).toLocaleString()}
                                    isSeen={true}
                                    attachment={
                                        item.attachment
                                            ? {
                                                fileName: item.attachment.fileName,
                                                fileSize: `${(item.attachment.fileSize / 1024 / 1024).toFixed(2)} MB`,
                                                fileType: item.attachment.type,
                                                fileUrl: item.attachment.url,
                                            }
                                            : undefined
                                    }
                                />
                                :
                                <SenderMessage
                                    message={item.text}
                                    time={new Date(item.updatedAt).toLocaleString()}
                                    avatar={`${server}${openChatUser?.profile_picture_url}`}
                                    attachment={
                                        item.attachment
                                            ? {
                                                fileName: item.attachment.fileName,
                                                fileSize: `${(item.attachment.fileSize / 1024 / 1024).toFixed(2)} MB`,
                                                fileType: item.attachment.type,
                                                fileUrl: item.attachment.url,
                                            }
                                            : undefined
                                    }
                                />
                            }
                        </div>
                    )
                })
            }
            <div ref={bottomRef}></div>
        </div>
    )
}

export default MessageArea