import { ArrowLeft, Mic, MicOff, Phone } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import api from "../lib/api"
import ErrorPage from "../Components/page-components/ErrorPage"
import Loader from "../Components/ui/Loder"
import useAuthStore from "../store/useAuthStore"
import clientCatchError from "../lib/clientCatchError"
import CallPopup from "../Components/ui/CallPopUp"
import { toast } from "sonner"
import socket from "../lib/socketClient"
import Modal from "../Components/ui/Modal"
import Button from "../Components/ui/Button"
import { BiLeftArrow } from "react-icons/bi"

interface ParticipantInterface {
  _id: string;
  fullname: string;
  email: string;
  profile_picture_url: string;
}

interface ChatInterface {
  _id: string;
  participants: ParticipantInterface[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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

type CallType = "pending" | "calling" | "user-busy" | "incoming" | "talking" | "end"

const AudioCall = () => {
  const [openModal, setOpenModal] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const chatId = pathname.split('/').pop()

  
  const [chatDataLoading, setChatDataLoading] = useState(true)
  const [fetchChatError, setFetchChatError] = useState<Error | null>(null)
  
  const [chatData, setChatData] = useState<ChatInterface | null>(null)
  
  const user = useAuthStore((state)=>state.user)
  const remoteUser = chatData?.participants.find((i)=>i._id !== user?.data._id)

  const [isMicOn, setIsMicOn] = useState(false)
  const [timer, setTimer] = useState(0)

  const localAudioRef = useRef<HTMLAudioElement | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const webRtcRef = useRef<RTCPeerConnection | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const [callOpen, setCallOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video">("audio");
  const [callDirection, setCallDirection] = useState<"incoming" | "outgoing">("incoming");
  const [isCallNotificationOpen, setIsCallNotifiactionOpen] = useState(false)
  const [callerName, setCallerName] = useState("");
  const [receiverName, setReceiverName] = useState("");

  const [audioCallStatus, setAuidoCallStatus] = useState<CallType>("pending")

  const [offerPayload, setOfferPayload] = useState<OfferPayloadInterface | null>(null)

    const [isRemoteUserBussy, setIsRemoteUserBusy] = useState<boolean>(false)

    const [iceServers, setIceServers] = useState<RTCIceServer[]>([]);


    useEffect(() => {
      const fetchIce = async () => {
        try {
          const {data} = await api.get('/twilio')
          setIceServers(data);
        } catch (error) {
          clientCatchError(error)
          setIceServers([
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
              ],
            },
          ]);
        }
      };

      fetchIce();
    }, []);

    const config = {
      iceServers
    };


  const stopAudio = () => {
    if (!audioRef.current) return;

    const player = audioRef.current;

    player.pause();

    setTimeout(() => {
      player.currentTime = 0;
    }, 0);
  };

  const playAudio = (src: string, loop: boolean = false) => {
    stopAudio();

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const player = audioRef.current;

    player.src = src;
    player.loop = loop;
    player.load();

    const playPromise = player.play();

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Audio play interrupted:", err);
      });
    }
  };

  const toggleMic = async () => {
    try {
      // FIRST TIME: stream create karo
      if (!localStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        localStreamRef.current = stream;

        if (localAudioRef.current) {
          localAudioRef.current.srcObject = stream;
          localAudioRef.current.play();
        }

        setIsMicOn(true);
        return;
      }

      // AFTER THAT: only mute/unmute
      const audioTrack = localStreamRef.current.getAudioTracks()[0];

      if (!audioTrack) return;

      audioTrack.enabled = !audioTrack.enabled;

      setIsMicOn(audioTrack.enabled);
    } catch (error) {
      return clientCatchError(error);
    }
  };


  const webRtcConnection = async()=>{
    try {
      webRtcRef.current =  new RTCPeerConnection(config)
      const localStream = localStreamRef.current

      if(!localStream){
        return console.log("Local stream not found");
      }

      localStream.getTracks().forEach((t)=>webRtcRef.current?.addTrack(t, localStream))

      webRtcRef.current.onicecandidate = (e)=>{
        if(e.candidate){
          socket.emit("audio-send-candidate", {candidate: e.candidate, roomId: chatId})
        }
      }

      webRtcRef.current.onconnectionstatechange = ()=>{
        console.log(webRtcRef.current?.connectionState);
      }

      webRtcRef.current.ontrack = (event) => {
        console.log("Remote track received");

        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
        }
      }
      
    }
    catch (error) {
      return clientCatchError(error)  
    }
  }

  const startAudiocall = async()=>{
    try {
      await toggleMic()
      await webRtcConnection()
      setAuidoCallStatus("calling")

      if(!webRtcRef.current){
        return null
      }

      const offer = await webRtcRef.current.createOffer()
      await webRtcRef.current.setLocalDescription(offer)

      startSenderCallUI()
      socket.emit("audio-send-offer", {offer, roomId: chatId, to: remoteUser?._id, callerName: user?.data.fullname})
    } 
    catch (error) {
     return clientCatchError(error)  
    }
  }

  const startSenderCallUI = () => {
    if (!remoteUser) {
      toast.error("User not loaded yet");
      return;
    }
    setIsCallNotifiactionOpen(true)
    setReceiverName(remoteUser?.fullname || "");
    setCallType("audio");
    setCallDirection("outgoing");
    setCallOpen(true);
  };

  const acceptCall = async()=>{
    try {
      await toggleMic()
      await webRtcConnection()
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

      socket.emit("audio-send-answer", {answer, roomId: chatId})

      setAuidoCallStatus("talking")
      setIsCallNotifiactionOpen(false)

    } 
    catch (error) {
      return clientCatchError(error)  
    }
  }

  const endCall = async()=>{
    try {
      setAuidoCallStatus("end")
      setIsCallNotifiactionOpen(false)
      socket.emit("audio-send-end-call", {roomId: chatId, to: remoteUser?._id})
      endStreaming()
      setOpenModal(true)
    } 
    catch (error) {
      clientCatchError(error)
    }
  }

  const endStreaming = ()=>{
    localStreamRef.current?.getTracks().forEach(track=>track.stop())
    if(localAudioRef.current){
      localAudioRef.current.srcObject = null
    }
    webRtcRef.current?.close();
    webRtcRef.current = null;
  }

  const redirectOnCallEnd = ()=>{
    setOpenModal(false)
    if(isMicOn) setIsMicOn(false)
    setTimer(0)
    navigate("/chat")
  }

  const onAcceptEndCall = async()=>{
    try {
      setAuidoCallStatus("end")
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
    setAuidoCallStatus("incoming")
    setOfferPayload(payload)
    playAudio('/start-ring.mp3')
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
      setAuidoCallStatus("talking")
      setIsCallNotifiactionOpen(false)
    } 
    catch (error) {
      return clientCatchError(error)  
    }
  }

  const onRemoteUserBusy = async()=>{
    try {
      console.log("remote bussy");
      setIsRemoteUserBusy(true)
      setAuidoCallStatus("user-busy")
    } 
    catch (error) {
      return clientCatchError(error)  
    }
  }

  useEffect(()=>{
    socket.on("audio-accept-offer", onAcceptOffer)
    socket.on("audio-accept-candidate", onAcceptCandidate)
    socket.on("audio-accept-answer", onAcceptAnswer)
    socket.on("audio-accept-end-call", onAcceptEndCall)
    socket.on("remote-user-busy", onRemoteUserBusy)

    return ()=>{
      socket.off("audio-accept-offer", onAcceptOffer)
      socket.off("audio-accept-candidate", onAcceptCandidate)
      socket.off("audio-accept-answer", onAcceptAnswer)
      socket.off("audio-accept-end-call", onAcceptEndCall)
      socket.off("remote-user-busy", onRemoteUserBusy)
    }
  },[])

  useEffect(()=>{
    const fetchChatData = async()=>{
      try {
        const {data} = await api.get(`/chat/${chatId}`)
        setChatData(data.data)
      } 
      catch (error) {
        if(error instanceof Error){
          setFetchChatError(error)
        }
      }
      finally{
        setChatDataLoading(false)
      }
    }

    fetchChatData()
  },[chatId])

    useEffect(()=>{

     let interval: ReturnType<typeof setInterval> | null = null;

    if(audioCallStatus === "pending"){
      return console.log("Call status is pending");
    }

    if(!audioRef.current){
      audioRef.current = new Audio()
    }

    if(audioCallStatus === "calling" && !isRemoteUserBussy) {
      playAudio("/call-ring.mp3")
    }
    if(audioCallStatus === "user-busy" && isRemoteUserBussy) {
      playAudio('/busy-ring.mp3')
    }

    if(audioCallStatus === "incoming") {
      playAudio("/start-ring.mp3")
    }

    if(audioCallStatus === "talking" ) {
      stopAudio()
      interval = setInterval(()=>{
        setTimer(prev => prev+1)
      },1000)
    }


    if(audioCallStatus === "end" ) {
      playAudio("/call-end.mp3")
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
  },[audioCallStatus])

  useEffect(() => {
    if (!chatId) return;
    socket.connect();
    socket.emit("join-room", chatId);

    return () => {
      socket.emit("leave-room", chatId);
      socket.disconnect();
    };
  }, [chatId]);

  if(chatDataLoading){
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Loader size={"lg"}/>
      </div>
    )
  }

  if(fetchChatError){
    return <ErrorPage message={fetchChatError.message}/>
  }

  return (
    <div className="w-full h-screen bg-slate-500 text-white flex flex-col">

      <audio hidden ref={localAudioRef} muted />
      <audio ref={remoteAudioRef} autoPlay />

      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">

        {/* Back + Timer */}
        <div className="w-24 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-slate-800 transition"
          >
            <ArrowLeft size={20} />
          </button>

          {audioCallStatus === "talking" && (
            <p className="text-green-400 font-medium text-sm">
              {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </p>
          )}
        </div>

        {/* Title */}
        <h1 className="text-lg font-semibold text-center flex-1">
          Audio Call
        </h1>

        <div className="w-24" />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center">

        <img
          src={`${remoteUser?.profile_picture_url}`}
          alt={remoteUser?.fullname}
          className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
        />

        <h2 className="mt-6 text-2xl font-semibold capitalize">
          {remoteUser?.fullname}
        </h2>

        <p className="mt-2 text-slate-300 text-sm">
          {audioCallStatus === "calling" && "Calling..."}
          {audioCallStatus === "incoming" && "Incoming call..."}
          {audioCallStatus === "talking" && "Connected"}
          {audioCallStatus === "end" && "Call ended"}
          {audioCallStatus === "pending" && "Ready to call"}
        </p>

      </div>

      {/* Controls */}
      <div className="h-28 flex items-center justify-center gap-8 border-t border-slate-800">

        {
          isMicOn ? (
            <button
              onClick={toggleMic}
              className="p-4 rounded-full bg-slate-700 active:scale-75 cursor-pointer transition"
            >
              <Mic size={24} />
            </button>
          ) : (
            <button
              onClick={toggleMic}
              className="p-4 rounded-full bg-red-700 active:scale-75 cursor-pointer transition"
            >
              <MicOff size={24} />
            </button>
          )
        }

        {
          (audioCallStatus === "pending" || audioCallStatus === "end") && (
            <button
              onClick={startAudiocall}
              className="p-5 rounded-full bg-green-600 active:scale-75 cursor-pointer transition shadow-lg"
            >
              <Phone size={26} />
            </button>
          )
        }

        {
          (audioCallStatus === "calling" || audioCallStatus === "talking") && (
            <button
              onClick={endCall}
              className="p-5 rounded-full bg-red-600 active:scale-75 cursor-pointer transition shadow-lg"
            >
              <Phone size={26} className="rotate-135" />
            </button>
          )
        }

      </div>

      {/* Call Popup */}
      {
        isCallNotificationOpen && (
          <div className="fixed inset-0 z-40 bg-black/40">
            <div className="relative z-50">
              <CallPopup
                onClose={() => {
                  setIsCallNotifiactionOpen(false);
                  setOpenModal(true)
                  stopAudio();
                }}
                open={callOpen}
                callerName={callerName}
                receiverName={receiverName}
                type={callType}
                direction={callDirection}
                position={"top-right"}
                onAccept={acceptCall}
                onReject={endCall}
                isBusy={isRemoteUserBussy}
              />
            </div>
          </div>
        )
      }

      {/* Modal */}
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
  )
}

export default AudioCall