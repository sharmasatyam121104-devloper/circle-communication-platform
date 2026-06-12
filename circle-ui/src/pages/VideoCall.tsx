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
import { Link, useLocation, useNavigate} from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import api from "../lib/api";
import ErrorPage from "../Components/page-components/ErrorPage";
import clientCatchError from "../lib/clientCatchError";
import { toast } from "sonner";
import socket from "../lib/socketClient";
import CallPopup from "../Components/ui/CallPopUp";
import { formatTime } from "../lib/time";
import Modal from "../Components/ui/Modal";
import Button from "../Components/ui/Button";
import { BiLeftArrow } from "react-icons/bi";


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

interface OfferPayloadInterface {
  offer: RTCSessionDescriptionInit;
  from: string;
  callerName: string;
}

interface CandidatePayloadInterface {
  candidate: RTCIceCandidateInit;
  from: string;
}

interface AnswerPayloadInterface {
  answer: RTCSessionDescriptionInit;
  from: string;
}



type CallType = "pending" | "calling" | "incoming" | "talking" | "end"

// type AudioSrcType = "/call-ring.mp3" |  "/start-ring.mp3" |  "/call-end.mp3"

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
  const [openModal, setOpenModal] = useState(false)
  const [micOn, setmicOn] = useState(false);
  const [VideoOn, setVideoOn] = useState(false);
  const [screenShareOn, setScreenShareOn] = useState(false);
  const [timer, setTimer] = useState(0)
  const [isRemoteStreamStart, setIsRemoteStreamStart] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const cameraStreamRef = useRef<MediaStream | null>(null)
  const webRtcRef = useRef<RTCPeerConnection | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [chatData, setChatData] = useState<ChatInterface | null>(null)
  const [chatDataError, setChatDataError] = useState<Error | null>(null)
  const user = useAuthStore((state)=>state.user)
  const remoteUser = chatData?.participants.find((participant) => participant._id !== user?.data._id);


  const navigate = useNavigate()
  const location = useLocation()
  const chatId = location.pathname.split('/').pop()
  const isMediaActive = VideoOn || micOn || screenShareOn;

  const [callOpen, setCallOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video">("video");
  const [callDirection, setCallDirection] = useState<"incoming" | "outgoing">("incoming");
  const [isCallNotificationOpen, setIsCallNotifiactionOpen] = useState(false)
  const [callEnd, setCallEnd] = useState(false)

  const [callerName, setCallerName] = useState("");
  const [receiverName, setReceiverName] = useState("");

  const [videoCallStatus, setVideoCallStatus] = useState<CallType>("pending")

  const [offerPayload, setOfferPayload] = useState<OfferPayloadInterface | null>(null)


  const toggleScreen = async () => {
    try {
      const localVideo = localVideoRef.current;
      if (!localVideo) return;

      // START SCREEN SHARE
      if (!screenShareOn) {

        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        const screenTrack = screenStream.getVideoTracks()[0];

        const sender = webRtcRef.current
          ?.getSenders()
          .find((s) => s.track?.kind === "video");

        if (screenTrack && sender) {
          await sender.replaceTrack(screenTrack);
        }

        localVideo.srcObject = screenStream;
        localStreamRef.current = screenStream;

        setScreenShareOn(true);
        setVideoOn(false);

        // Browser screen share stop button pressed
        screenTrack.onended = async () => {

          const cameraStream = cameraStreamRef.current;

          if (!cameraStream) {
            setScreenShareOn(false);
            return;
          }

          const cameraTrack =
            cameraStream.getVideoTracks()[0];

          const sender = webRtcRef.current
            ?.getSenders()
            .find((s) => s.track?.kind === "video");

          if (cameraTrack && sender) {
            await sender.replaceTrack(cameraTrack);
          }

          localVideo.srcObject = cameraStream;
          localStreamRef.current = cameraStream;

          setScreenShareOn(false);
          setVideoOn(cameraTrack.enabled);
        };
      }

      // STOP SCREEN SHARE MANUALLY
      else {

        const screenStream = localStreamRef.current;

        screenStream?.getTracks().forEach((track) => {
          track.stop();
        });

        const cameraStream = cameraStreamRef.current;

        if (!cameraStream) {
          localVideo.srcObject = null;
          localStreamRef.current = null;
          setScreenShareOn(false);
          return;
        }

        const cameraTrack =
          cameraStream.getVideoTracks()[0];

        const sender = webRtcRef.current
          ?.getSenders()
          .find((s) => s.track?.kind === "video");

        if (cameraTrack && sender) {
          await sender.replaceTrack(cameraTrack);
        }

        localVideo.srcObject = cameraStream;
        localStreamRef.current = cameraStream;

        setScreenShareOn(false);
        setVideoOn(cameraTrack.enabled);
      }

    } catch (error) {
      clientCatchError(error);
    }
  };

  const toggleVideo = async () => {
    try {
      const localVideo = localVideoRef.current;
      if (!localVideo) return;

      if (!VideoOn) {
        if(screenShareOn){
           return toast.info("Please off screen share first.")
        }

        const cameraTrack =
          cameraStreamRef.current?.getVideoTracks()[0];

        if (cameraTrack) {
          cameraTrack.enabled = true;

          localVideo.srcObject = cameraStreamRef.current;
          localStreamRef.current = cameraStreamRef.current;

          setVideoOn(true);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        cameraStreamRef.current = stream;

        localVideo.srcObject = stream;
        localStreamRef.current = stream;

        setVideoOn(true);
        setmicOn(true);

      } else {

        const videoTrack =
          cameraStreamRef.current?.getVideoTracks()[0];

        if (videoTrack) {
          videoTrack.enabled = false;
          setVideoOn(false);
        }

      }
    } catch (error) {
      clientCatchError(error);
    }
};

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
    const localStream = localStreamRef.current
    if(!rtc){
      return console.log("rtc not found");
    }
    if(!localStream){
      return console.log("localStream not found");
    }

    localStream.getTracks().forEach((track)=>{
      rtc.addTrack(track, localStream)
    })
    
    rtc.onicecandidate = (e)=>{
      if(e.candidate){
        socket.emit("send-candidate", {candidate: e.candidate, roomId: chatId, to: remoteUser?._id})
      }
    }

    rtc.onconnectionstatechange = ()=>{
      console.log(rtc.connectionState);
    }

    rtc.ontrack = (e)=>{
      const remoteStream = e.streams[0]
      const remoteVideo = remoteVideoRef.current
      if(!remoteVideo) return console.log("remote video not found");
      if(!remoteStream) return console.log("remote stream not found");

      remoteVideo.srcObject = remoteStream

      const videoTracks = remoteStream.getVideoTracks()[0]
      
      if(videoTracks){
        videoTracks.onmute = ()=>{
          console.log(`video off remote side`);
        }
        videoTracks.onunmute = ()=>{
          console.log(`video on remote side`);
        }
        videoTracks.onended = ()=>{
          console.log(`video end`);
        }
      }
    }


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
      setVideoCallStatus("calling")
      startSenderCallUI()
      setIsRemoteStreamStart(true)
      socket.emit("send-offer", {offer, roomId: chatId, to: remoteUser?._id, callerName: user?.data.fullname})
    } 
    catch (error) {
      clientCatchError(error)
    }
  }

  const startSenderCallUI = () => {
    if (!remoteUser) {
      toast.error("User not loaded yet");
      return;
    }
    setIsCallNotifiactionOpen(true)
    setReceiverName(remoteUser?.fullname || "");
    setCallType("video");
    setCallDirection("outgoing");
    setCallOpen(true);
  };


  const acceptCall = async()=>{
    try {
      await toggleVideo()
      webRtcConnection()
      if(!offerPayload){
        return console.log("offerPayload not found.");
      }

      if(!webRtcRef.current){
        return console.log("webRtcRef.current not found in acceptCall.");
      }

      const offer = new RTCSessionDescription(offerPayload.offer)
      await webRtcRef.current.setRemoteDescription(offer)

      const answer = await webRtcRef.current.createAnswer()
      await webRtcRef.current.setLocalDescription(answer)

      socket.emit("send-answer", {answer, roomId: chatId})

      setVideoCallStatus("talking")
      setIsCallNotifiactionOpen(false)
      setIsRemoteStreamStart(true)

    } 
    catch (error) {
      return clientCatchError(error)  
    }
  }

  const endCall = async()=>{
    try {
      setVideoCallStatus("end")
      setIsCallNotifiactionOpen(false)
      socket.emit("send-end-call", {roomId: chatId})
      endStreaming()
      setOpenModal(true)
    } 
    catch (error) {
      clientCatchError(error)
    }
  }

  const endStreaming = ()=>{
    localStreamRef.current?.getTracks().forEach(track=>track.stop())
    if(localVideoRef.current){
      localVideoRef.current.srcObject = null
    }
    if(remoteVideoRef.current){
      remoteVideoRef.current.srcObject = null
    }
  }

  const redirectOnCallEnd = ()=>{
    setOpenModal(false)
    // navigate('/chat')
    if(VideoOn) setVideoOn(false)
    if(micOn) setmicOn(false)
    if(screenShareOn) setScreenShareOn(false)
    setCallEnd(true)
    setTimer(0)
    navigate("/chat")
  }

  const onAcceptEndCall = async()=>{
    try {
      setVideoCallStatus("end")
      setIsCallNotifiactionOpen(false)
      endStreaming()
      setOpenModal(true)
    } 
    catch (error) {
      return clientCatchError(error)  
    }
  }

  const onAcceptOffer = (payload: OfferPayloadInterface)=>{
    setIsCallNotifiactionOpen(true)
    setCallerName(payload.callerName);
    setCallDirection("incoming");
    setCallOpen(true);
    setVideoCallStatus("incoming")
    setOfferPayload(payload)
  }

  const onAcceptCandidate = async(payload: CandidatePayloadInterface)=>{
    try {
      if(!webRtcRef.current){
        return
      }
      const candidate = new RTCIceCandidate(payload.candidate)
      await webRtcRef.current.addIceCandidate(candidate)
    } 
    catch (error) {
      return clientCatchError(error)
    }
  }

  const onAcceptAnswer = async(payload: AnswerPayloadInterface)=>{
    try {
        if(!webRtcRef.current){
          return
        }
      const answer = new RTCSessionDescription(payload.answer)
      await webRtcRef.current.setRemoteDescription(answer)
      setVideoCallStatus("talking")
      setIsCallNotifiactionOpen(false)
    } 
    catch (error) {
      return clientCatchError(error)  
    }
  }



  useEffect(()=>{
    socket.on("accept-offer", onAcceptOffer)
    socket.on("accept-candidate", onAcceptCandidate)
    socket.on("accept-answer", onAcceptAnswer)
    socket.on("accept-end-call", onAcceptEndCall)

    return ()=>{
      socket.off("accept-offer", onAcceptOffer)
      socket.off("accept-candidate", onAcceptCandidate)
      socket.off("accept-answer", onAcceptAnswer)
      socket.off("accept-end-call", onAcceptEndCall)
    }
  },[])


  useEffect(() => {
    if (!chatId) return;
    socket.connect();
    socket.emit("join-room", chatId);

    return () => {
      socket.disconnect();
      socket.emit("leave-room", chatId);
    };
  }, [chatId]);


  useEffect(()=>{

     let interval: ReturnType<typeof setInterval> | null = null;

    if(videoCallStatus === "pending"){
      return console.log("Call status is pending");
    }

    if(!audioRef.current){
      audioRef.current = new Audio()
    }

    if(videoCallStatus === "calling") {
      audioRef.current.pause()
      audioRef.current.src = "/call-ring.mp3"
      audioRef.current.currentTime = 0
      audioRef.current.load()
      audioRef.current.play()
    }

    if(videoCallStatus === "incoming") {
      audioRef.current.pause()
      audioRef.current.src = "/start-ring.mp3"
      audioRef.current.currentTime = 0
      audioRef.current.load()
      audioRef.current.play()
    }

    if(videoCallStatus === "talking" ) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      interval = setInterval(()=>{
        setTimer(prev => prev+1)
      },1000)
    }


    if(videoCallStatus === "end" ) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = "/call-end.mp3"
      audioRef.current.load()
      audioRef.current.play()
    }

    return()=>{
      if(audioRef.current){
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
      if (interval) {
        clearInterval(interval);
      }
    }
  },[videoCallStatus])


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
  },[chatId])


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
            <p className="text-xs text-gray-500">{formatTime(timer)}</p>
        </div>

        <div className="w-8" />
      </div>

      {/* VIDEO AREA */}
      <div className="flex-1 p-3 flex flex-col min-h-0">

        {/* VIDEO GRID */}
        <div
          className="
            flex-1 
            grid grid-cols-1 md:grid-cols-2 
            gap-3
            min-h-0
          "
        >

          {/* Remote video section */}
          <div className="relative bg-gray-900 border border-gray-700 shadow-sm rounded-2xl overflow-hidden flex items-center justify-center aspect-video">

            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${
                (isRemoteStreamStart) ? "block" : "hidden"
              }`}
            />

            {(!isRemoteStreamStart || callEnd ) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <img
                  src={`${server}${remoteUser?.profile_picture_url}`}
                  alt={remoteUser?.fullname}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />

                <p className="text-white text-lg font-medium capitalize">
                  {remoteUser?.fullname}
                </p>

                <span className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded bg-black/70 text-white capitalize">
                  {remoteUser?.fullname}
                </span>
              </div>
            )}
          </div>

          {/* Local video section */}
          <div className="relative bg-gray-900 border border-gray-700 shadow-sm rounded-2xl overflow-hidden flex items-center justify-center aspect-video">

            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                isMediaActive ? "block" : "hidden"
              }`}
            />

            {!isMediaActive && (
              <div className="flex flex-col items-center justify-center gap-2">
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

          {
            videoCallStatus === "talking" ? 
              <button
                onClick={endCall}
                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition active:scale-75"
              >
                <Phone size={20} className="rotate-135" />
              </button> :
              <button
                onClick={startCall}
                className="p-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition active:scale-75"
              >
                <Phone size={20} className="" />
              </button>
          }
        </div>
        {
          isCallNotificationOpen &&
          <div className="fixed inset-0 z-40 bg-black/40 pointer-events-auto">
            <div className="relative z-50">
              <CallPopup
                onClose={()=>setIsCallNotifiactionOpen(false)}
                open={callOpen}
                callerName={callerName}
                receiverName={receiverName}
                type={callType}
                direction={callDirection}
                onAccept={acceptCall}
                onReject={endCall}
              />
            </div>
          </div>
        }
        <Modal isOpen={openModal} onClose={redirectOnCallEnd}>
          <div className="flex flex-col items-center text-center py-4">
            
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
              Call Disconnected
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              The call has ended or the other participant left the meeting.
            </p>

            <Button
              onClick={redirectOnCallEnd}
              bgColor="bg-red-600"
              className="mt-6 flex items-center gap-2"
            >
              <BiLeftArrow />
              Go Back
            </Button>
          </div>
        </Modal>
    </div>
  );
};

export default VideoCall;