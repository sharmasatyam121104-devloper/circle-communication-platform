import { useState, type SyntheticEvent } from "react"
import LoginComponents from "../Components/page-components/LoginComponents"
import { toast } from "sonner";
import clientCatchError from "../lib/clientCatchError";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const getMe = useAuthStore(
    (state) => state.getMe
  );

  const handleLogin = async(e: SyntheticEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try {
        setLoading(true)
        await api.post("/user/login", formData)
        getMe()
        toast.success("Login success.")
        navigate('/chat')
    } 
    catch (error) {
        return clientCatchError(error)
    }
    finally{
        setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    try {
      setGoogleLoading(true)
      window.location.href = `${import.meta.env.VITE_SERVER}/user/google`;
    } 
    catch (error) {
      setGoogleLoading(false)
      return clientCatchError(error)
    }
  };

  return (
    <LoginComponents
      formData={formData}
      setFormData={setFormData}
      loading={loading}
      handleLogin={handleLogin}
      handleGoogleLogin={handleGoogleLogin}
      googleLoading={googleLoading}
    />
  );
};

export default Login