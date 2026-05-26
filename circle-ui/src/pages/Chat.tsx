import { ArrowBigLeft, ArrowUpRight, LogOutIcon, MessageCircleDashed } from "lucide-react"
import Avatar from "../Components/ui/Avtar"
import Button from "../Components/ui/Button"
import Logo from "../Components/ui/Logo"
import { CgAttachment } from "react-icons/cg"
import Input from "../Components/ui/Input"
import { IoCallOutline } from "react-icons/io5"
import SenderMessage from "../Components/chats/SenderMessage"
import ReceiverMessage from "../Components/chats/ReciverMessage"
import { MdOutlineVideoCall } from "react-icons/md"
import ChatMemberCard from "../Components/chats/ChatMemberCard"
import { Link, useNavigate, useParams } from "react-router-dom"
import clientCatchError from "../lib/clientCatchError"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import api from "../lib/api"
import useAuthStore from "../store/useAuthStore"
import AddChatSidebarMembers from "../Components/chats/AddChatSidebarMembers"
import Tooltip from "../Components/ui/Tooltip"

interface LastMessageInterface {
  _id: string;
  message: string;
  createdAt: string;
}

interface ParticipantInterface {
  _id: string;
  fullname: string;
  email: string;
  profile_picture_url: string;
}

interface ChatInterface {
  _id: string;
  participants: ParticipantInterface[];
  lastMessage: LastMessageInterface;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const server = import.meta.env.VITE_SERVER;

const Chat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isChatOpen = Boolean(id); 

  const [logoutLoading, setLogoutLoading] = useState(false)
  const setUser = useAuthStore.getState().setUser;

  const [isAddMemberInChatModalOpen, setIsAddMemberInChatModalOpen] = useState(false)
  const [allChats, setAllChats] = useState<ChatInterface[]>([])
  const [allChatsLoading, setAllChatsLoading ] = useState(false)

  const user = useAuthStore((state)=>state.user)


  const handleLogout = async()=>{
    try {
      setLogoutLoading(true)
      const {data} = await api.get('/user/logout')
      setUser(null);
      toast.info(data.message)
      navigate('/login')
    } 
    catch (error) {
      clientCatchError(error)  
    }
    finally{
      setLogoutLoading(false)
    }
  }

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
  },[])


  return (
    <div className="h-screen  flex bg-indigo-300 p-2">
      <div
          className={`
            ${isChatOpen ? "hidden lg:block" : "block"}
            w-full lg:w-3/12 p-2
          `}
        >
        <div className="flex  items-center  h-fit py-2  bg-white rounded-2xl">
          <Tooltip
            content={
              <div className="w-80">
                {/* Profile Section */}
                <div className="flex items-center gap-4">
                  <img
                    src={
                      `${server}${user?.data?.profile_picture_url}` || ""
                    }
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover border border-zinc-700"
                  />

                  <div>
                    <h2 className="text-lg font-semibold">
                      {user?.data?.fullname}
                    </h2>

                    <p className="text-sm text-zinc-400 break-all">
                      {user?.data?.email}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Created At</span>

                    <span>
                    {user?.data?.createdAt
                      ? new Date(user.data.createdAt).toLocaleDateString()
                      : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Last Login</span>

                    <span>
                      {user?.data?.last_login
                      ? new Date(user.data.last_login).toLocaleDateString()
                      : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <button
                  className="
                    mt-5
                    w-full
                    bg-white
                    text-black
                    py-2.5
                    rounded-xl
                    font-medium
                    hover:bg-zinc-200
                    transition-all
                    active:scale-75
                  "
                >
                  Update Image
                </button>
              </div>
            }
          >
            <Avatar
              src={`${server}${user?.data?.profile_picture_url}`}
              name={user?.data?.fullname}
              size="w-14 h-14"
              className="ml-7 border-2 border-red-500"
            />
          </Tooltip>
            <Logo className="ml-15"/>
        </div>

        <div className="lg:h-144 h-[82vh] w-full bg-gray-600 my-2 rounded-2xl p-2 overflow-y-auto">
          {
            allChats && allChats.map((items: ChatInterface)=>{
              const otherParticipant = items.participants.find(
                (participant: ParticipantInterface) => participant._id !== user?.data?._id
            );

              return (
                  <ChatMemberCard
                    key={items._id}
                    name={otherParticipant?.fullname || ""}
                    lastMessage={items.lastMessage?.message || "No messages yet"}
                    avatar={`${server}${otherParticipant?.profile_picture_url}`}
                    isOnline={true}
                    onClick={() => navigate(`/chat/${otherParticipant?._id}`)}
                  />
                  )
            })

          }
        </div>

        <div className="  h-12 flex justify-between items-center rounded-2xl ">
          <Button onClick={handleLogout} className="ml-6 flex gap-4 hover:bg-red-400 active:scale-90" bgColor="bg-red-600" loading={logoutLoading} disabled={logoutLoading}> <LogOutIcon/> LogOut</Button>
          <Button onClick={()=>setIsAddMemberInChatModalOpen(true)} className="mr-6 flex gap-4 hover:bg-green-400 active:scale-90" bgColor="bg-green-600"><MessageCircleDashed/>New Chat</Button>
        </div>

      </div>
      <div className="lg:w-9/12 w-full bg-gray-600 rounded-2xl m-2">
        {
          isChatOpen === false 
          ?
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
          :
          <>
            <div
              className={`
                ${!isChatOpen ? "hidden lg:block" : "block"}
                flex items-center justify-between gap-2
                w-full bg-white rounded-t-2xl px-3 lg:px-6 py-2
              `}
            >
              <Link to={'/chat'} className="block lg:hidden"><ArrowBigLeft/></Link>
              <div className="flex gap-2">
                <Avatar/>
                <div>
                  <h1 className="font-medium">dummy@gmail.com</h1>
                  <p className="text-sm">dummy name</p>
                </div>
              </div>

              <div className="flex gap-5 justify-center items-center mr-8">
                <h1 className="text-4xl hover:text-green-400 active:scale-75 cursor-pointer"><MdOutlineVideoCall /></h1>
                <h1 className="text-3xl hover:text-green-400 active:scale-75 cursor-pointer"><IoCallOutline /></h1>
              </div>
            </div>

            <div className="lg:h-140 h-[80vh] overflow-y-auto">
                <SenderMessage
                  message="Bhai ye project report dekh"
                  time="9:12 PM"
                  isSeen={true}
                  avatar="https://i.pravatar.cc/150?img=5"
                  attachment={{
                    fileName: "MERN_Project_Report.pdf",
                    fileSize: "2.4 MB",
                    fileType: "PDF",
                    fileUrl: "/files/report.pdf",
                  }}
                />
                <ReceiverMessage
                  message="Bhai message receive ho gaya"
                  time="9:12 PM"
                  isSeen={true}
                />
            </div>

            <div className="flex items-center gap-2 px-2 lg:px-4 py-2">

              <div className="bg-white rounded-full p-2 active:scale-95 cursor-pointer shrink-0">
                <CgAttachment className="text-3xl lg:text-4xl text-indigo-600" />
              </div>

              <div className="flex-1">
                <Input
                  height="h-12 lg:h-14"
                  placeholder="Write your message here..."
                />
              </div>

              <div className="bg-indigo-600 rounded-full p-3 lg:p-4 active:scale-95 cursor-pointer shrink-0 hover:bg-green-600">
                <ArrowUpRight size={22} className="text-white" />
              </div>

            </div>
          </>
        }
      </div>
      <AddChatSidebarMembers
        isAddMemberInChatModalOpen={isAddMemberInChatModalOpen}
        setIsAddMemberInChatModalOpen={setIsAddMemberInChatModalOpen}
      />
    </div>
  )
}

export default Chat