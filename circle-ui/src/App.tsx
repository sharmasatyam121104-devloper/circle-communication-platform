import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ProtectedRoute from "./routes/ProtectedRoute"
import Chat from "./pages/Chat"
import useAuthStore from "./store/useAuthStore"
import { useEffect } from "react"
import PublicRoute from "./routes/PublicRoute"



const App = () => {
  const getMe = useAuthStore((state) => state.getMe);

  useEffect(() => {
    getMe();
  }, []);

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
          {/* <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Route>
    </Routes>
    </div>
  )
}

export default App