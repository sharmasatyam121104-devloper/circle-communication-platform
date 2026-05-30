import { ArrowBigLeft, ArrowUpRight, MessageCircleDashed } from "lucide-react"
import Avatar from "../Components/ui/Avtar"
import Button from "../Components/ui/Button"
import Logo from "../Components/ui/Logo"
import { CgAttachment } from "react-icons/cg"
import Input from "../Components/ui/Input"
import { IoCallOutline } from "react-icons/io5"
import { MdOutlineVideoCall } from "react-icons/md"
import ChatMemberCard from "../Components/chats/ChatMemberCard"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import clientCatchError from "../lib/clientCatchError"
import { useEffect, useState } from "react"
import api from "../lib/api"
import useAuthStore from "../store/useAuthStore"
import AddChatSidebarMembers from "../Components/chats/AddChatSidebarMembers"
import Tooltip from "../Components/ui/Tooltip"
import Loader from "../Components/ui/Loder"
import MessageArea from "../Components/chats/MessageArea"
import LogoutComponents from "../Components/page-components/LogoutComponents"
import ChatAttachment from "../Components/chats/ChatAttachment"
import UploadProgressBar from "../Components/ui/UploadProgressBar"
import socket from "../lib/socketClient"

interface LastMessageInterface {
  _id: string;
  text: string;
  createdAt: string;
}

interface ParticipantInterface {
  _id: string;
  fullname: string;
  email: string;
  profile_picture_url: string;
}

interface AttachmentInterface {
    url: string;
    type: string;
    fileName: string;
    fileSize: number;
}

interface ChatInterface {
  _id: string;
  participants: ParticipantInterface[];
  lastMessage: LastMessageInterface;
  createdAt: string;
  updatedAt: string;
  __v: number;
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

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { userId: id } = useParams();
  const isChatOpen = Boolean(id); 

  

  const [isAddMemberInChatModalOpen, setIsAddMemberInChatModalOpen] = useState(false)
  const [allChats, setAllChats] = useState<ChatInterface[]>([])
  const [allChatsLoading, setAllChatsLoading ] = useState(false)
  const [openChatUser , setOpenChatUser] = useState<ParticipantInterface | null>(null)
  const [openChatId, setOpenChatId] = useState("")

  const [message, setMessage] = useState("")
  const [addMessageInChat, setAddMessageInChat] = useState<MessageInterface | null>(null)
  const [sendMessageLoading, setSendMessageLoading] = useState(false)

  const user = useAuthStore((state)=>state.user)
  const userImageUrl = `${server}${user?.data?.profile_picture_url}?t=${user?.data?.updatedAt}`;

  const openUserId = location.pathname.split("/").pop()

  const [attachment, setAttachment] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [newLastMessage, setNewLastmessage] = useState<string | null>(null)

  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  const [joinChat, setJoinChat] = useState(false)



  useEffect(()=>{
    const getAllChats = async()=>{
      try {
        setAllChatsLoading(true)
        const {data} = await api.get('/chat')
        setAllChats(data.data)
      } 
      catch (error) {
        clientCatchError(error)
      }
      finally{
        setAllChatsLoading(false)
      }
    }

    getAllChats()
  },[isAddMemberInChatModalOpen])

  useEffect(()=>{
    if (!allChats || !openUserId ) return;

    allChats.forEach((items: ChatInterface) => {

      const otherParticipant = items.participants.find(
        (participant: ParticipantInterface) =>
          participant._id !== user?.data?._id
      );
      
      if (otherParticipant?._id === openUserId) {
        setOpenChatUser(otherParticipant);
        setOpenChatId(items._id)
      }
    });

  },[allChats, openChatUser, user, openUserId])


  const sendMessage = async () => {
    try {
      setSendMessageLoading(true);

      const finalMessage = message.trim();

      if (!finalMessage && !attachment) {
        throw new Error("Please enter message or attach a file");
      }

      const formData = new FormData();
      formData.append("chatId", openChatId);
      formData.append("text", finalMessage || "file");

      if (attachment) {
        formData.append("attachment", attachment);
      }

      setNewLastmessage(finalMessage || "file")

      const { data } = await api.post(
        "/message",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (e) => {
            if (!e.total) return;

            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          },
        }
      );

      // setAddMessageInChat(data.data);
      if(joinChat){
        socket.emit("send-message", data.data)
      }
    }
     catch (error) {
      setUploadProgress(0);
      clientCatchError(error);
    } 
    finally {
      setMessage("");
      setAttachment(null);
      setUploadProgress(0);
      setSendMessageLoading(false);
    }
  };

  useEffect(() => {
    socket.connect();
    socket.on("online-users", (users) => {
      setOnlineUsers(users)
    });

    return () => {
      socket.disconnect();
      socket.off("online-users");
    };
  }, []);
  

  if(allChatsLoading){
    return (
      <div className="flex items-center justify-center">
        <Loader size="lg"/>
      </div>
    )
  }



return (
  <div className="h-dvh flex bg-indigo-300 p-1 lg:p-2 overflow-hidden">
    
    {/* Sidebar */}
    <div
      className={`
        ${isChatOpen ? "hidden lg:block" : "block"}
        w-full lg:w-3/12
        h-full
        p-1 lg:p-2
      `}
    >
      <div className="flex items-center h-fit py-2 bg-white rounded-2xl">
        <Tooltip
          content={
            <div className="w-64">
              {/* Profile Section */}
              <div className="flex items-center gap-3">
                <img
                  src={`${server}${user?.data?.profile_picture_url}` || ""}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover border border-zinc-700"
                />

                <div>
                  <h2 className="text-sm font-semibold">
                    {user?.data?.fullname}
                  </h2>

                  <p className="text-xs text-zinc-400 break-all">
                    {user?.data?.email}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-zinc-400">Created</span>

                  <span className="text-right">
                    {user?.data?.createdAt
                      ? new Date(user.data.createdAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-zinc-400">Last Login</span>

                  <span className="text-right">
                    {user?.data?.last_login
                      ? new Date(user.data.last_login).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              <Link
                to={"/update-img"}
                className="
                  mt-5
                  w-full
                  flex
                  items-center
                  justify-center
                  bg-white
                  text-black
                  py-2
                  rounded-lg
                  text-sm
                  font-medium
                  hover:bg-zinc-200
                  transition-all
                  active:scale-95
                "
              >
                Update Image
              </Link>
            </div>
          }
        >
          <Avatar
            src={userImageUrl}
            name={user?.data?.fullname}
            size="w-12 h-12 lg:w-14 lg:h-14"
            className="ml-3 lg:ml-7 border-2 border-red-500"
          />
        </Tooltip>

        <Logo className="ml-4 lg:ml-15" />
      </div>

      {/* Chat List */}
      <div className="h-[calc(100dvh-150px)] lg:h-[calc(100vh-160px)] w-full bg-gray-600 my-2 rounded-2xl p-2 overflow-y-auto">
        {allChats &&
          allChats.map((items: ChatInterface) => {
            const otherParticipant = items.participants.find(
              (participant: ParticipantInterface) =>
                participant._id !== user?.data?._id
            );

            return (
              <ChatMemberCard
                key={items._id}
                name={otherParticipant?.fullname || ""}
                lastMessage={
                  openChatId === items._id
                    ? (newLastMessage ?? items.lastMessage?.text)
                    : (items.lastMessage?.text || "No messages yet")
                }
                avatar={`${server}${otherParticipant?.profile_picture_url}`}
                isOnline={onlineUsers.includes(otherParticipant?._id || "")}
                onClick={() => {
                  navigate(`/chat/${otherParticipant?._id}`);
                  setOpenChatId(items._id);
                }}
              />
            );
          })}
      </div>

      {/* Buttons */}
      <div className="h-12 flex justify-between items-center gap-2 px-2">
        <LogoutComponents/>

        <Button
          onClick={() => setIsAddMemberInChatModalOpen(true)}
          className="flex gap-2 lg:gap-4 hover:bg-green-400 active:scale-90 text-sm"
          bgColor="bg-green-600"
        >
          <MessageCircleDashed />
          New Chat
        </Button>
      </div>
    </div>

    {/* Chat Area */}
    <div
      className={`
        ${!isChatOpen ? "hidden lg:block" : "block"}
        w-full lg:w-9/12
        h-full
        min-h-0
        bg-gray-600
        rounded-2xl
        lg:m-2
        overflow-hidden
      `}
    >
      {isChatOpen === false ? (
        <div className="hidden lg:flex h-full flex-col justify-center items-center text-white px-6 text-center">
          <div className="bg-indigo-500 p-5 rounded-full shadow-lg mb-6">
            <MessageCircleDashed size={50} />
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Welcome to Circle Chat
          </h1>

          <p className="text-gray-300 max-w-md leading-relaxed">
            Select a conversation from the left sidebar to start chatting
            with your friends and team members.
          </p>

          <p className="text-sm text-gray-400 mt-4">
            Send messages, share files, and stay connected in real-time.
          </p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          
          {/* Topbar */}
          <div
            className="
              flex items-center justify-between gap-2
              w-full bg-white rounded-t-2xl
              px-3 lg:px-6 py-2
            "
          >
            <Link to={"/chat"} className="block lg:hidden">
              <ArrowBigLeft />
            </Link>

            <div className="flex gap-2 items-center min-w-0">
              <Avatar src={`${server}${openChatUser?.profile_picture_url}`}/>

              <div className="min-w-0">
                <h1 className="font-medium truncate text-sm lg:text-base">
                  {openChatUser?.email}
                </h1>

                <p className="text-xs lg:text-sm truncate">
                  {openChatUser?.fullname}
                </p>
              </div>
            </div>

            <div className="flex gap-3 lg:gap-5 justify-center items-center">
              <Link to={`/video-call/${openChatId}`} className="text-3xl lg:text-4xl hover:text-green-400 active:scale-75 cursor-pointer">
                <MdOutlineVideoCall />
              </Link>

              <Link to={`/audio-call/${openChatId}`} className="text-2xl lg:text-3xl hover:text-green-400 active:scale-75 cursor-pointer">
                <IoCallOutline />
              </Link>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <MessageArea openChatId={openChatId} openChatUser={openChatUser} addMessageInChat={addMessageInChat} joinChat={joinChat} setJoinChat={setJoinChat}/>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-2 lg:px-4 py-2 bg-gray-600">
            <div className="bg-white rounded-full p-2 active:scale-95 cursor-pointer shrink-0 relative">
              <CgAttachment className="text-2xl lg:text-4xl text-indigo-600" />
              <ChatAttachment file={attachment} setFile={setAttachment}/>
            </div>

            <div className="flex-1 flex flex-col gap-2">

                {attachment && (
                  <div className="relative w-fit max-w-55 lg:max-w-75 p-2 bg-gray-100 rounded-xl">

                    {/* IMAGE */}
                    {attachment.type.startsWith("image/") && (
                      <img
                        src={URL.createObjectURL(attachment)}
                        className="w-32 h-32 lg:w-44 lg:h-44 object-cover rounded-xl border"
                      />
                    )}

                    {/* VIDEO */}
                    {attachment.type.startsWith("video/") && (
                      <video
                        src={URL.createObjectURL(attachment)}
                        controls
                        className="w-40 h-40 lg:w-52 lg:h-52 rounded-xl"
                      />
                    )}

                    {/* PDF */}
                    {attachment.type === "application/pdf" && (
                      <div className="w-40 h-40 lg:w-52 lg:h-52 flex flex-col items-center justify-center bg-white rounded-xl border">
                        <p className="text-red-500 font-semibold">PDF File</p>
                        <a
                          href={URL.createObjectURL(attachment)}
                          target="_blank"
                          className="text-blue-600 text-sm underline"
                        >
                          Open PDF
                        </a>
                      </div>
                    )}

                    {/* OTHER FILES */}
                    {!attachment.type.startsWith("image/") &&
                      !attachment.type.startsWith("video/") &&
                      attachment.type !== "application/pdf" && (
                        <div className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-xl">
                          <p className="text-sm text-gray-700 truncate">
                            {attachment.name}
                          </p>
                        </div>
                      )}

                    {/* CLOSE BUTTON */}
                    <button
                      onClick={() => setAttachment(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm"
                    >
                      ✕
                    </button>

                  </div>
                )}

                {sendMessageLoading && (
                  <UploadProgressBar progress={uploadProgress} />
                )}

                <Input
                    height="h-11 lg:h-14"
                    placeholder="Write your message here..."
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />

            </div>

            <Button
              onClick={sendMessage}
              loading={sendMessageLoading}
              disabled={sendMessageLoading}
              className="bg-indigo-600 rounded-full p-3 lg:p-4 active:scale-95 cursor-pointer shrink-0 hover:bg-green-600"
            >
              <ArrowUpRight size={22} className="text-white" />
            </Button>
          </div>
        </div>
      )}
    </div>

    <AddChatSidebarMembers
      isAddMemberInChatModalOpen={isAddMemberInChatModalOpen}
      setIsAddMemberInChatModalOpen={
        setIsAddMemberInChatModalOpen
      }
    />
  </div>
)
}

export default Chat