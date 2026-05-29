import {  useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  ScreenShare,
  ArrowLeft,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const VideoCall = () => {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const location = useLocation();



  return (
    <div className="w-full h-screen bg-indigo-400 text-gray-800 flex flex-col">

      {/* HEADER */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-gray-300 backdrop-blur-md">

        <Link
          to={`/chat/${location.pathname.split("/").pop()}`}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="text-center">
          <h1 className="text-sm font-semibold text-slate-800">
            Aarav Sharma
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

          {/* Remote */}
          <div className="flex-1 rounded-2xl bg-gray-400 border border-gray-200 shadow-sm flex items-center justify-center relative">

            <p className="text-gray-500 text-sm">Remote User</p>

            <span className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded bg-gray-800 text-white">
              Aarav
            </span>
          </div>

          {/* Local */}
          <div className="flex-1 rounded-2xl bg-gray-400 border border-gray-200 shadow-sm flex items-center justify-center relative">

            <p className="text-gray-500 text-sm">You</p>

            <span className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded bg-indigo-400 text-white">
              You
            </span>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
        <div className="h-20 flex items-center justify-center gap-4 bg-gray-500 border-t border-gray-200 shadow-sm">

          {/* Mute */}
          <button
            onClick={() => setMuted((p) => !p)}
            className={`p-3 rounded-full transition active:scale-75 ${
              muted
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {muted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Video */}
          <button
            onClick={() => setVideoOff((p) => !p)}
            className={`p-3 rounded-full transition active:scale-75 ${
              videoOff
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {videoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>

          {/* Screen Share */}
          <button
            onClick={() => setScreenShare((p) => !p)}
            className={`p-3 rounded-full transition active:scale-75 ${
              screenShare
                ? "bg-indigo-100 text-indigo-600"
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