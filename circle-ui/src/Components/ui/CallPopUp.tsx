import { Phone, PhoneOff, Video, Mic, X } from "lucide-react";

type CallType = "audio" | "video";

interface CallPopupProps {
  open: boolean;
  callerName: string;
  receiverName?: string;
  type: CallType;
  direction?: "incoming" | "outgoing";
  isBusy?: boolean;

  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

  onAccept?: () => void;
  onReject?: () => void;
  onClose?: () => void;
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
  isBusy = false,
  position = "bottom-right",
  onAccept,
  onReject,
  onClose,
}: CallPopupProps) => {
  if (!open) return null;

  if (isBusy) {
    return (
      <div className={`fixed z-50 ${positionClasses[position]} w-80`}>
        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-red-600">
              Call Declined
            </h3>

            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 active:scale-75"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center py-2">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <PhoneOff size={24} className="text-red-600" />
            </div>

            <p className="font-semibold text-gray-800 capitalize">
              {receiverName}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              is currently busy on another call
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed z-50 ${positionClasses[position]} w-80`}
    >
      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-4 ">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {type === "video" ? (
              <div>
                <Video size={18} className="text-indigo-600" />
                <h3 className="text-sm font-medium text-indigo-800">Video Call Comming</h3>
              </div>
            ) : (
              <div className="flex gap-3 items-center">
                <Mic size={18} className="text-green-600" />
                <h3 className="text-sm font-medium text-indigo-800">Audio Call Comming</h3>
              </div>
            )}

            <span className="text-sm font-semibold capitalize">
              {type} Call
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-400">
              {direction}
            </span>
            {
              direction === "incoming" &&
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 active:scale-75"
              >
                <X size={18} />
              </button>
            }
          </div>
        </div>

        <div className="text-sm text-gray-700 mb-3">
          {direction === "incoming" ? (
            <>
              <p className="font-medium capitalize">{callerName}</p>
              <p className="text-xs text-gray-500">is calling you...</p>
            </>
          ) : (
            <>
              <p className="font-medium capitalize">Calling {receiverName}</p>
              <p className="text-xs text-gray-500">ringing...</p>
            </>
          )}
        </div>

        <div className="flex justify-center mb-3">
          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
        </div>

        <div className="flex justify-between gap-3">
          {direction === "incoming" ? (
            <>
              <button
                onClick={onReject}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg active:scale-75"
              >
                <PhoneOff size={16} />
                Reject
              </button>

              <button
                onClick={onAccept}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg active:scale-75"
              >
                <Phone size={16} />
                Accept
              </button>
            </>
          ) : (
            <button
              onClick={onReject}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
            >
              <PhoneOff size={16} />
              Cut Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallPopup;