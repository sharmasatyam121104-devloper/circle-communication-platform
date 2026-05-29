import { useEffect, useRef } from "react";
import { Phone, PhoneOff, Video, Mic } from "lucide-react";

type CallType = "audio" | "video";

interface CallPopupProps {
  open: boolean;
  callerName: string;
  receiverName?: string;
  type: CallType;
  direction?: "incoming" | "outgoing";

  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

  onAccept: () => void;
  onReject: () => void;
}

const positionClasses = {
  "top-left": "top-5 left-5",
  "top-right": "top-5 right-5",
  "bottom-left": "bottom-5 left-5",
  "bottom-right": "bottom-5 right-5",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

const CallPopup = ({
  open,
  callerName,
  receiverName,
  type,
  direction = "incoming",
  position = "bottom-right",
  onAccept,
  onReject,
}: CallPopupProps) => {
  const ringRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    ringRef.current = new Audio("/ringtone.mp3");
    ringRef.current.loop = true;
  }, []);

  useEffect(() => {
    if (open && direction === "incoming") {
      ringRef.current?.play().catch(() => {});
    } else {
      ringRef.current?.pause();
    }
  }, [open, direction]);

  if (!open) return null;

  return (
    <div
      className={`fixed z-50 ${positionClasses[position]} w-80`}
    >
      {/* Card */}
      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-4 animate-pulse">

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {type === "video" ? (
              <Video size={18} className="text-indigo-600" />
            ) : (
              <Mic size={18} className="text-green-600" />
            )}

            <span className="text-sm font-semibold capitalize">
              {type} Call
            </span>
          </div>

          <span className="text-xs text-gray-400">
            {direction}
          </span>
        </div>

        {/* Info */}
        <div className="text-sm text-gray-700 mb-3">
          {direction === "incoming" ? (
            <>
              <p className="font-medium">{callerName}</p>
              <p className="text-xs text-gray-500">is calling you...</p>
            </>
          ) : (
            <>
              <p className="font-medium">Calling {receiverName}</p>
              <p className="text-xs text-gray-500">ringing...</p>
            </>
          )}
        </div>

        {/* Ring animation */}
        <div className="flex justify-center mb-3">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-3">

          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
          >
            <PhoneOff size={16} />
            Reject
          </button>

          <button
            onClick={onAccept}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
          >
            <Phone size={16} />
            Accept
          </button>

        </div>
      </div>
    </div>
  );
};

export default CallPopup;