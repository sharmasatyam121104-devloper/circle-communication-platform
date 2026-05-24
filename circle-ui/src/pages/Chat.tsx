import { ArrowUpRight, LogOutIcon, MessageCircleDashed } from "lucide-react"
import Avatar from "../Components/ui/Avtar"
import Button from "../Components/ui/Button"
import Logo from "../Components/ui/Logo"
import { CgAttachment } from "react-icons/cg"
import Input from "../Components/ui/Input"
import { IoCallOutline } from "react-icons/io5"
import SenderMessage from "../Components/chats/SenderMessage"
import ReceiverMessage from "../Components/chats/ReciverMessage"
import { MdOutlineVideoCall } from "react-icons/md"

const Chat = () => {

  return (
    <div className="h-screen  flex bg-indigo-300 p-2">
      <div className=" w-3/12 p-2">
        <div className="flex  items-center  h-fit py-2  bg-white rounded-2xl">
            <Avatar className="ml-7"/>
            <Logo className="ml-15"/>
        </div>
        <div className="h-10/12 w-full bg-gray-600 my-2 rounded-2xl">

        </div>
        <div className="  h-12 flex justify-between items-center rounded-2xl ">
          <Button className="ml-6 flex gap-4 hover:bg-red-400 active:scale-90" bgColor="bg-red-600"> <LogOutIcon/> LogOut</Button>
          <Button className="mr-6 flex gap-4 hover:bg-green-400 active:scale-90" bgColor="bg-green-600"><MessageCircleDashed/>New Chat</Button>
        </div>
      </div>
      <div className="w-9/12 bg-gray-600 rounded-2xl m-2">
        <div className="flex items-center justify-between gap-1 w-full bg-white rounded-t-2xl px-6 py-1">
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

        <div className="h-140 overflow-y-auto">
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
        <div className="flex items-center h-16 mb-8">
          <div className="bg-white ml-6 rounded-full p-2 active:scale-95 cursor-pointer">
            <CgAttachment className="text-4xl text-indigo-600 "/>
          </div>
          <Input height="h-17 mb-2 ml-6" placeholder="Write your message here..."/>
          <div className="bg-indigo-600 ml-6 rounded-full p-4 active:scale-95 cursor-pointer h-fit w-fit flex items-center justify-center mr-8 hover:bg-green-600">
             <ArrowUpRight  size={27} className=" text-white"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat