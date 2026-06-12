import { Mic, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import api from "../lib/api"
import ErrorPage from "../Components/page-components/ErrorPage"
import Loader from "../Components/ui/Loder"


const AudioCall = () => {

  const location = useLocation()
  const pathname = location.pathname
  const chatId = pathname.split('/').pop()

  const [chatDataLoading, setChatDataLoading] = useState(true)
  const [fetchChatError, setFetchChatError] = useState<Error | null>(null)

  useEffect(()=>{
    const fetchChatData = async()=>{
      try {
        const {data} = await api.get(`/chat/${chatId}`)
        console.log(data.data);
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

    {/* Header */}
    <div className="h-16 flex items-center justify-center border-b border-slate-800">
      <h1 className="text-lg font-semibold">
        Audio Call
      </h1>
    </div>

    {/* Main */}
    <div className="flex-1 flex flex-col items-center justify-center">

      <img
        src="https://i.pravatar.cc/300?img=12"
        alt="User"
        className="w-40 h-40 rounded-full object-cover border-4 border-white"
      />

      <h2 className="mt-6 text-2xl font-semibold">
        John Doe
      </h2>

      <p className="mt-2 text-slate-400">
        Calling...
      </p>

    </div>

    {/* Controls */}
    <div className="h-28 flex items-center justify-center gap-8 border-t border-slate-800">

      <button className="p-4 rounded-full bg-slate-700">
        <Mic size={24} />
      </button>

      <button className="p-5 rounded-full bg-red-600">
        <Phone size={26} className="rotate-135" />
      </button>

    </div>

  </div>
  )
}

export default AudioCall