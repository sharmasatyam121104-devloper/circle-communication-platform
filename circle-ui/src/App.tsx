import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ProtectedRoute from "./routes/ProtectedRoute"
import Chat from "./pages/Chat"
import useAuthStore from "./store/useAuthStore"
import { useEffect } from "react"
import PublicRoute from "./routes/PublicRoute"
import UpdateImage from "./pages/UpdateImage"
import AudioCall from "./pages/AudioCall"
import VideoCall from "./pages/VideoCall"
import socket from "./lib/socketClient"

interface IncomingCallDataInterface{
  chatId: string
}


const App = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const getMe = useAuthStore((state) => state.getMe);


  useEffect(() => {
    const handleIncomingVideoCall = (data: IncomingCallDataInterface) => {

      if (location.pathname.startsWith("/video-call/")) {
        return console.log("alredy in video call page");;
      }

      navigate(`/video-call/${data.chatId}`);

      console.log("navigate called");
      };

    socket.on("video-call-comming", handleIncomingVideoCall);

    return () => {
      socket.off("video-call-comming", handleIncomingVideoCall);
    };
  }, [navigate, location.pathname]);

  useEffect(() => {
    const handleIncomingVideoCall = (data: IncomingCallDataInterface) => {

      if (location.pathname.startsWith("/video-call/")) {
        return console.log("alredy in video call page");;
      }

      navigate(`/audio-call/${data.chatId}`);

      console.log("navigate called");
      };

    socket.on("voice-call-comming", handleIncomingVideoCall);

    return () => {
      socket.off("voice-call-comming", handleIncomingVideoCall);
    };
  }, [navigate, location.pathname]);

  useEffect(() => {
    socket.emit("get-online-users")
    getMe();
  }, [getMe]);

  return (
    <div>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/audio-call/:chatId" element={<AudioCall />} />
          <Route path="/video-call/:chatId" element={<VideoCall/>} />
          <Route path="/update-img" element={<UpdateImage />} />
        </Route>
    </Routes>
    </div>
  )
}

export default App