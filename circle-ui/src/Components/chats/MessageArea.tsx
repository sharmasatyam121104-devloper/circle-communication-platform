import { useEffect, useRef, useState } from "react"
import ReceiverMessage from "./ReciverMessage"
import SenderMessage from "./SenderMessage"
import clientCatchError from "../../lib/clientCatchError"
import api from "../../lib/api"
import useAuthStore from "../../store/useAuthStore"
import Loader from "../ui/Loder"
import socket from "../../lib/socketClient"
import NotificationPopup from "../ui/NotificationPopup"
import { useNavigate } from "react-router-dom"

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
    sendersData: ParticipantInterface[]
}

interface AttachmentInterface {
    url: string;
    type: string;
    fileName: string;
    fileSize: number;
}

export interface MessageInterface {
    _id: string;
    chat: string;
    sender: string;
    text: string;
    attachment?: AttachmentInterface;
    status: "sent" | "delivered" | "read"
    updatedAt: string
}

interface ParticipantInterface {
  _id: string;
  fullname: string;
  email: string;
  profile_picture_url: string;
}



const server = import.meta.env.VITE_SERVER;

const MessageArea = ({openChatId, openChatUser, addMessageInChat, joinChat, setJoinChat, sendersData}: MessageAreaProps) => {

    const [allMessageOfChat, setAllMessgaeOfChat] = useState<MessageInterface[]>([])
    const [allMessageOfChatLoading, setAllMessgaeOfChatLoading] = useState(false)

    const user = useAuthStore((state)=>state.user)

    const bottomRef = useRef<HTMLDivElement | null>(null)

    const limit = 20;

    const [notification, setNotification] = useState({
        _id: "",
        fullname: "",
        email: "",
        profile_picture_url: "",
        message: "",
        time: "",
    });
    const [showNotification, setShowNotification] = useState(false)
    const navigate = useNavigate();

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }


    //for showing incoming messsages notification
    useEffect(() => {
        const handler = ({senderId,message,}: {senderId: string;message: MessageInterface;}) => {

            if (senderId === user?.data?._id) return;

            if (message.chat === openChatId) {
                return;
            }

            const matchingSender = sendersData.find(
                (sender) => sender._id === senderId
            );

            setNotification({
                _id: senderId,
                fullname: matchingSender?.fullname || "New Message",
                email: matchingSender?.email || "",
                profile_picture_url:
                    matchingSender?.profile_picture_url || "",
                message: message.text,
                time: message.updatedAt,
            });

            setShowNotification(true);
        };

        socket.on("msg-notification", handler);

        return () => {
            socket.off("msg-notification", handler);
        };
    }, [openChatId, sendersData, user]);


    //for receiving msg
    useEffect(() => {
        if (!joinChat) return;

        const handler = (data: MessageInterface) => {
            setAllMessgaeOfChat((prev) => [...prev, data]);

            if (data.sender !== user?.data._id) {
                socket.emit("message-delivered", {
                    messageId: data._id,
                    chatId: data.chat
                });
            }
        };

        socket.on("recive-message", handler);

        return () => {
            socket.off("recive-message", handler);
        };
    }, [joinChat, user?.data._id]);



    useEffect(() => {
        const handleStatusUpdate = (updatedMessage: MessageInterface) => {
            setAllMessgaeOfChat((prev) =>
                prev.map((msg) =>
                    msg._id === updatedMessage._id
                        ? updatedMessage
                        : msg
                )
            );
        };

        socket.on("message-status-update", handleStatusUpdate);

        return () => {
            socket.off("message-status-update", handleStatusUpdate);
        };
    }, []);


    
    useEffect(() => {
        const handleMessagesRead = ({ chatId }: { chatId: string }) => {
            if (chatId !== openChatId) return;
            if(!openChatId) return;
            setAllMessgaeOfChat((prev) =>
                prev.map((msg) =>
                    msg.sender === user?.data?._id
                        ? { ...msg, status: "read" }
                        : msg
                )
            );
        };

        socket.on("messages-read", handleMessagesRead);

        return () => {
            socket.off("messages-read", handleMessagesRead);
        };
    }, [openChatId, addMessageInChat, user]);



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

    
    useEffect(() => {
        const handleConnect = () => {
            if (openChatId) {
            socket.emit("join-chat", openChatId);
            }
        };

        socket.on("connect", handleConnect);

        return () => {
            socket.off("connect", handleConnect);
            setJoinChat(false);
        };
    }, []);

useEffect(() => {
    if (!openChatId) return;

    const emitRead = () => {
        socket.emit("join-chat", openChatId);

        socket.emit("messages-read", {
            chatId: openChatId
        });

        setJoinChat(true);
    };

    emitRead();

    return () => {
        socket.emit("leave-chat", openChatId);
        setJoinChat(false);
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
                allMessageOfChat?.map((item: MessageInterface)=>{
                    return (
                        <div key={item._id}>
                            {
                                item.sender === user?.data._id ? 
                                <ReceiverMessage
                                    message={item.text}
                                    time={new Date(item.updatedAt).toLocaleString()}
                                    status={item.status}
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
            {
                showNotification && (
                <NotificationPopup
                    name={notification.fullname}
                    message={notification.message}
                    time={notification.time}
                    profileImage={`${server}${notification.profile_picture_url}`}
                    onClick={() => {
                        navigate(`/chat/${notification._id}`);
                        setShowNotification(false);
                    }}
                    onClose={() => {
                        setShowNotification(false);
                    }}
                    className="top-5 right-5"
                />
                )
            }
            

            <div ref={bottomRef}></div>
        </div>
    )
}

export default MessageArea