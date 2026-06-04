import {  useEffect, useRef, useState } from "react";
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
import clientCatchError from "../lib/clientCatchError";
import { toast } from "sonner";


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

const config = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
};

const VideoCall = () => {
  const [micOn, setmicOn] = useState(false);
  const [VideoOn, setVideoOn] = useState(false);
  const [screenShareOn, setScreenShareOn] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const webRtcRef = useRef<RTCPeerConnection | null>(null)

  const [chatData, setChatData] = useState<ChatInterface | null>(null)
  const [chatDataError, setChatDataError] = useState<Error | null>(null)
  const user = useAuthStore((state)=>state.user)
  const remoteUser = chatData?.participants.find((participant) => participant._id !== user?.data._id);


  const location = useLocation()
  const chatId = location.pathname.split('/').pop()
  const isMediaActive = VideoOn || micOn || screenShareOn;


  const toggleScreen = async()=>{
    try {
      const localVideo = localVideoRef.current 
      if(!localVideo) return

      if(!screenShareOn){
        const stream = await navigator.mediaDevices.getDisplayMedia({video: true})
      
        localVideo.srcObject = stream
        localStreamRef.current = stream
        setScreenShareOn(true)
      }
      else{
        const localStream = localStreamRef.current
        localStreamRef.current = null
        if(!localStream) return

        localStream.getTracks().forEach((track)=>track.stop())
        localVideo.srcObject = null
        localStreamRef.current = null
        setScreenShareOn(false)
      }
    } 
    catch (error) {
      clientCatchError(error)  
    }
  }

  const toggleVideo = async()=>{
    try {
      const localVideo = localVideoRef.current
      if(!localVideo) return

      if(!VideoOn){
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})

        localVideo.srcObject = stream
        localStreamRef.current = stream
        setVideoOn(true)
        setmicOn(true)
      }
      else{
        const localStream = localStreamRef.current
        if(!localStream) return

        localStream.getTracks().forEach((track)=>track.stop())
        localVideo.srcObject = null
        localStreamRef.current = null
        setVideoOn(false)
        setmicOn(false)
      }
    } 
    catch (error) {
      clientCatchError(error)  
    }
  }

  const toggleMic = ()=>{
    try {
      const localStream = localStreamRef.current
      if(!localStream) return

      const audioTrack = localStream.getTracks().find((track)=>track.kind === "audio")
      if(audioTrack){
        audioTrack.enabled = !audioTrack.enabled
        setmicOn(audioTrack.enabled)
      }
    } 
    catch (error) {
      clientCatchError(error)  
    }
  }

  const webRtcConnection = ()=>{
    webRtcRef.current = new RTCPeerConnection(config)

    const rtc = webRtcRef.current
    const localStram = localStreamRef.current
    if(!rtc){
      return console.log("rtc not found");
    }
    if(!localStram){
      return console.log("localStream not found");
    }


    rtc.onicecandidate = (e)=>{
      console.log(e.candidate);
    }

    rtc.onconnectionstatechange = ()=>{
      console.log(rtc.connectionState);
    }

    rtc.ontrack = ()=>{
      console.log("something is comming fron other user sides");
    }

    localStram.getTracks().forEach((track)=>{
      rtc.addTrack(track, localStram)
    })

  }

  const startCall = async()=>{
    try {
      if(!VideoOn && !screenShareOn){
        return toast.info("Please start your video or screen first to stsrt call.")
      }

      webRtcConnection()

      const rtc = webRtcRef.current
      if(!rtc) return console.log("rtc not found");

      const offer = await rtc.createOffer()
      await rtc.setLocalDescription(offer)
    } 
    catch (error) {
      clientCatchError(error)
    }
  }


  const endCall = async()=>{
    try {
      alert()
    } 
    catch (error) {
      clientCatchError(error)
    }
  }



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
            <video
                ref={localVideoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover rounded-2xl ${
                  isMediaActive ? "block" : "hidden"
                }`}
              />

              {!isMediaActive && (
                <div>
                  <img
                    src={`${server}${user?.data?.profile_picture_url}`}
                    alt={user?.data?.fullname}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white"
                  />
                  <p className="text-white text-lg font-medium capitalize">
                    {user?.data?.fullname}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* CONTROLS */}
        <div className="h-20 flex items-center justify-center gap-4 bg-gray-500 border-t border-gray-200 shadow-sm">

          {/* Mute */}
          <button
            onClick={toggleMic}
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
            onClick={toggleVideo}
            className={`p-3 rounded-full transition active:scale-75 ${
              VideoOn
                ? "bg-red-100 text-green-600"
                : "bg-gray-100 text-red-700"
            }`}
          >
            {VideoOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreen}
            className={`p-3 rounded-full transition active:scale-75 ${
              screenShareOn
                ? "bg-indigo-400 text-indigo-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <ScreenShare size={20} />
          </button>

          <button
            onClick={startCall}
            className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition active:scale-75"
          >
            <Phone size={20} className="" />
          </button>
          <button
            onClick={endCall}
            className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition active:scale-75"
          >
            <Phone size={20} className="rotate-135" />
          </button>
        </div>
    </div>
  );
};

export default VideoCall;