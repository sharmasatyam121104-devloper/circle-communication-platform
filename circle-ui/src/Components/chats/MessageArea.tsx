import { useEffect, useRef, useState } from "react"
import ReceiverMessage from "./ReciverMessage"
import SenderMessage from "./SenderMessage"
import clientCatchError from "../../lib/clientCatchError"
import api from "../../lib/api"
import useAuthStore from "../../store/useAuthStore"
import Loader from "../ui/Loder"

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

const MessageArea = ({openChatId, openChatUser, addMessageInChat}: MessageAreaProps) => {

    const [allMessageOfChat, setAllMessgaeOfChat] = useState<MessageInterface[] | null>(null)
    const [allMessageOfChatLoading, setAllMessgaeOfChatLoading] = useState(false)

    const user = useAuthStore((state)=>state.user)

    const bottomRef = useRef<HTMLDivElement | null>(null)

    const limit = 20;

    // scroll bottom
    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }


// const divRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const div = divRef.current;
//     if (!div) return;

//     const handleScroll = () => {
//       console.log(div.scrollTop);
//     };

//     div.addEventListener("scroll", handleScroll);

//     return () => {
//       div.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

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

                setAllMessgaeOfChat(
                data.chatMessages.reverse() // old -> new order
                )
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
                        <div key={item.updatedAt}>
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