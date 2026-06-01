import {  useEffect, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  ScreenShare,
  ArrowLeft,
} from "lucide-react";
import { Link, useLocation} from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import api from "../lib/api";
import ErrorPage from "../Components/page-components/ErrorPage";


interface ParticipantInterface {
  _id: string;
  fullname: string;
  email: string;
  profile_picture_url: string;
}

interface ChatInterface {
  _id: string;
  participants: ParticipantInterface[];
}

const server = import.meta.env.VITE_SERVER;

const VideoCall = () => {
  const [micOn, setmicOn] = useState(true);
  const [videoOn, setvideoOn] = useState(true);
  const [screenShareOn, setscreenShareOn] = useState(false);
  
  const [chatData, setChatData] = useState<ChatInterface | null>(null)
  const [chatDataError, setChatDataError] = useState<Error | null>(null)
  const user = useAuthStore((state)=>state.user)
  const remoteUser = chatData?.participants.find((participant) => participant._id !== user?.data._id);


  const location = useLocation()
  const chatId = location.pathname.split('/').pop()

  //Fetch chat data from chatId 
  useEffect(()=>{
    const fetchChatData = async()=>{
      try {
        const {data} = await api.get(`/chat/${chatId}`)
        setChatData(data.data)
        setChatDataError(null)
      }
      catch (error) {
        if(error instanceof Error){
          setChatDataError(error)
        }
      }
    }

    fetchChatData()
  },[])


  if(chatDataError){
    return <ErrorPage message={chatDataError.message}/>
  }


  return (
    <div className="w-full h-screen bg-indigo-400 text-gray-800 flex flex-col">

      {/* HEADER */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-gray-300 backdrop-blur-md">

        <Link
          to={`/chat`}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="text-center">
          <h1 className="text-sm font-semibold text-slate-800 capitalize">
            {remoteUser?.fullname}
          </h1>
            <p className="text-xs text-gray-500">{"00.00.00"}</p>
        </div>

        <div className="w-8" />
      </div>

      {/* VIDEO AREA */}
      <div className="flex-1 p-3 flex flex-col ">

        {/* VIDEO GRID */}
        <div
          className="
            flex-1 
            flex flex-col md:grid md:grid-cols-2 
            gap-3
          "
        >

          {/* Remote video section */}
          <div className="flex-1 rounded-2xl bg-gray-400 border border-gray-200 shadow-sm flex flex-col items-center justify-center relative gap-3">

            <img
              src={`${server}${remoteUser?.profile_picture_url}`}
              alt={remoteUser?.fullname}
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
            />

            <p className="text-white text-lg font-medium capitalize">
              {remoteUser?.fullname}
            </p>

            <span className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded bg-gray-800 text-white capitalize">
              {remoteUser?.fullname}
            </span>
          </div>

          {/* Local video section */}
          <div className="flex-1 rounded-2xl bg-gray-400 border border-gray-200 shadow-sm flex flex-col items-center justify-center relative gap-3">

            <img
              src={`${server}${user?.data?.profile_picture_url}`}
              alt={user?.data.fullname}
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
            />

            <p className="text-white text-lg font-medium capitalize">
              {user?.data.fullname} (You)
            </p>

            <span className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded bg-indigo-400 text-white capitalize">
              {user?.data.fullname} (You)
            </span>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
        <div className="h-20 flex items-center justify-center gap-4 bg-gray-500 border-t border-gray-200 shadow-sm">

          {/* Mute */}
          <button
            onClick={() => setmicOn((p) => !p)}
            className={`p-3 rounded-full transition active:scale-75 ${
              micOn
                ? "bg-red-100 text-green-600"
                : "bg-gray-100 text-red-700"
            }`}
          >
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Video */}
          <button
            onClick={() => setvideoOn((p) => !p)}
            className={`p-3 rounded-full transition active:scale-75 ${
              videoOn
                ? "bg-red-100 text-green-600"
                : "bg-gray-100 text-red-700"
            }`}
          >
            {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setscreenShareOn((p) => !p)}
            className={`p-3 rounded-full transition active:scale-75 ${
              screenShareOn
                ? "bg-indigo-400 text-indigo-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <ScreenShare size={20} />
          </button>

          {/* Hangup */}
          <button
            className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition active:scale-75"
          >
            {/* <Phone size={20} className="rotate-135" /> */}
            <Phone size={20} className="" />
          </button>
        </div>
    </div>
  );
};

export default VideoCall;