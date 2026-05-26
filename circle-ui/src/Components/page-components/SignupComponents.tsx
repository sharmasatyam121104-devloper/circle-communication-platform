import { FcGoogle } from "react-icons/fc"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Logo from "../ui/Logo"
import { ArrowUpRight } from "lucide-react"
import { type ChangeEvent, type Dispatch, type SetStateAction, type SyntheticEvent } from "react"
import AuthLink from "../ui/AuthLinker"

type FormDataType = {
  fullname: string,
  email: string,
  password: string,
}

type SignupProp = {
  formData: FormDataType;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  loading: boolean;
  handleSignup: (e: SyntheticEvent<HTMLFormElement>) => void;
  handleGoogleLogin:() => void;
  googleLoading: boolean
}

const SignupComponents = ({formData, setFormData, loading, handleSignup, handleGoogleLogin, googleLoading}: SignupProp) => {


  const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setFormData((prev)=>({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen lg:bg-slate-300 bg-indigo-500 flex justify-center items-center ">
      <div className="h-160 w-120 bg-indigo-500 rounded-lg hover:shadow-2xl py-4">
          <div className="flex flex-col justify-center items-center mt-2">
              <Logo/>
              <h1 className="text-amber-100 font-medium text-4xl mb-2">Welcom to Circle</h1>
              <p className="font-mono">Please Signup to use services.!</p>
          </div>
          <div className="px-6 mt-6">
              <form className="flex flex-col gap-2" onSubmit={handleSignup}>
                <Input 
                  label="Fullname :" labelTextSize={"text-lg"} 
                  placeholder="Enter Your Fullname."
                  value={formData.fullname}
                  name={"fullname"}
                  type="text"
                  onChange={(e)=>handleChange(e)}
                />
                <Input 
                  label="Email :" labelTextSize={"text-lg"} 
                  placeholder="Enter Your Email."
                  value={formData.email}
                  name={"email"}
                  type="email"
                  onChange={(e)=>handleChange(e)}
                />
                <Input 
                  label="Password :" labelTextSize={"text-lg"} 
                  type="password" placeholder="Enter Your Password."
                  value={formData.password}
                  name="password"
                  onChange={(e)=>handleChange(e)}
                />
                <Button width="w-full" type="submit" loading={loading}
                  className="mt-4 font-bold active:scale-50 flex gap-2
                ">
                  <ArrowUpRight />Signup Now
                </Button>
              </form>
          </div>
          <div className="px-6">
            <Button onClick={handleGoogleLogin} disabled={googleLoading} loading={googleLoading} className="mt-6 active:scale-50" width="w-full" bgColor="bg-rose-500">
              <FcGoogle size={20} />

              <span className="text-[#ebdedd] font-medium ml-4">
                Continue with Google
              </span>
            </Button>
          </div>
          <AuthLink
            text="Already have an account?"
            to="/login"
            linkText="Login"
          />
      </div>
    </div>
  )
}

export default SignupComponents