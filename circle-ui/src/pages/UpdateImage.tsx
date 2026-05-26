import { Upload } from "lucide-react"
import Button from "../Components/ui/Button"
import { useNavigate } from "react-router-dom"
import clientCatchError from "../lib/clientCatchError"
import api from "../lib/api"
import { toast } from "sonner"
import { useState } from "react"

const UpdateImage = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    

    const goOnChat = ()=>{
        navigate('/chat')
    }

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const formData = new FormData();

        formData.append("profilePicture", file);
        try {
            setLoading(true)
            const {data} = await api.put("/user/profile-picture", formData)
            toast.success(data.message)
            navigate('/chat')
        } 
        catch (error) {
            clientCatchError(error)
        }
        finally{
            setLoading(false)
        }
    };

  return (
    <div className="h-screen w-full flex items-center justify-center">
        <div className="w-6/12 h-6/12 shadow-2xl flex flex-col items-center rounded-2xl rounded-t-4xl border-t-16 border-indigo-600">
            <h1 className="text-4xl font-bold text-slate-800">Upadte Your Profile Photo</h1>
            <div className="flex flex-col justify-center items-center bg-slate-700 mt-8 pb-4 gap-4 rounded-b-4xl rounded-l-full rounded-r-full text-white">
                <input type="file" className="ml-40 mt-8 text-3xl" onChange={uploadImage}/>
                <Upload className=" text-3xl"/>
            </div>
            <div className="flex gap-6 mt-8">
                <Button loading={loading} disabled={loading}>Update now</Button>
                <Button loading={loading} disabled={loading} bgColor="bg-rose-600" onClick={goOnChat}>Cancel now</Button>
            </div>
        </div>
    </div>
  )
}

export default UpdateImage