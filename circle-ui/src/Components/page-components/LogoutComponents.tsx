import { LogOutIcon } from "lucide-react"
import Button from "../ui/Button"
import { useState } from "react"
import api from "../../lib/api"
import useAuthStore from "../../store/useAuthStore"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import clientCatchError from "../../lib/clientCatchError"

const LogoutComponents = () => {
     const [logoutLoading, setLogoutLoading] = useState(false)
     const setUser = useAuthStore.getState().setUser;
     const navigate = useNavigate()

    const handleLogout = async()=>{
        try {
        setLogoutLoading(true)
        const {data} = await api.get('/user/logout')
        setUser(null);
        toast.info(data.message)
        navigate('/login')
        } 
        catch (error) {
        clientCatchError(error)  
        }
        finally{
        setLogoutLoading(false)
        }
    }
  return (
    <Button
        onClick={handleLogout}
        className="flex gap-2 lg:gap-4 hover:bg-red-400 active:scale-90 text-sm"
        bgColor="bg-red-600"
        loading={logoutLoading}
        disabled={logoutLoading}
    >
        <LogOutIcon />
        LogOut
    </Button>
  )
}

export default LogoutComponents