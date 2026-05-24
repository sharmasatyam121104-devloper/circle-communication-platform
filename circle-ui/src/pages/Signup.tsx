import { useState, type SyntheticEvent } from 'react'
import SignupComponents from '../Components/page-components/SignupComponents'
import clientCatchError from '../lib/clientCatchError'
import api from '../lib/api'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [formData, setFormData] = useState({
      fullname: "",
      email: "",
      password: ""
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSignup = async(e: SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        setLoading(true)
        const {data} = await api.post("/user/signup", formData)
        toast.success(data.message)
        navigate('/login')
      } 
      catch (error) {
        clientCatchError(error)
      }
      finally{
        setLoading(false)
      }
    };

  return (
    <SignupComponents 
      formData={formData}
      setFormData={setFormData}
      loading={loading}
      handleSignup={handleSignup}
    />
  )
}

export default Signup