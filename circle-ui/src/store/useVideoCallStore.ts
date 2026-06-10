
import { create } from "zustand";

interface OfferPayloadInterface {
  offer: RTCSessionDescriptionInit;
  from: string;
  callerName: string;
}

type VideoCallStore = {
  isCallNotificationOpen: boolean;
  callerName: string;
  receiverName: string;
  callType: "audio" | "video";
  callDirection: "incoming" | "outgoing";
  offerPayload: OfferPayloadInterface | null;

  openCallNotification: (data: any) => void;
  closeCallNotification: () => void;
};

export const useVideoCallStore = create<VideoCallStore>((set) => ({
  isCallNotificationOpen: false,
  callerName: "",
  receiverName: "",
  callType: "video",
  callDirection: "incoming",
  offerPayload: null,

  openCallNotification: (data) =>
    set({
      isCallNotificationOpen: true,
      ...data,
    }),

  closeCallNotification: () =>
    set({
      isCallNotificationOpen: false,
    }),
}));