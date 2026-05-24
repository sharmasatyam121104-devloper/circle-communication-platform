import { FcGoogle } from "react-icons/fc"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Logo from "../ui/Logo"
import { ArrowUpRight } from "lucide-react"
import {  type ChangeEvent, type Dispatch, type SetStateAction, type SyntheticEvent} from "react"
import AuthLink from "../ui/AuthLinker"

type FormDataType = {
  email: string,
  password: string
}

type LoginProps = {
  formData: FormDataType;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  loading: boolean;
  handleLogin: (e: SyntheticEvent<HTMLFormElement>) => void;
};

const LoginComponents = ({ formData, setFormData, loading, handleLogin }: LoginProps) => {

  const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target;
    setFormData((prev: FormDataType)=>({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen lg:bg-gray-300 backdrop-blur-md bg-indigo-500 flex justify-center items-center ">
      <div className="h-140 w-120 bg-indigo-500 py-12 rounded-lg hover:shadow-2xl ">
          <div className="flex flex-col justify-center items-center mt-2">
              <Logo/>
              <h1 className="text-amber-100 font-medium text-4xl mb-2">Welcom to Circle</h1>
              <p className="font-mono">Please login to use services.!</p>
          </div>
          <div className="px-6 mt-6">
              <form className="flex flex-col gap-2" onSubmit={handleLogin}>
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
                <Button width="w-full" type={"submit"} loading={loading}
                  className="mt-4 font-bold active:scale-50 flex gap-2
                ">
                  <ArrowUpRight />Login Now
                </Button>
              </form>
          </div>
          <div className="px-6">
            <Button  className="mt-6 active:scale-50" width="w-full" bgColor="bg-rose-500">
              <FcGoogle size={20} />

              <span className="text-[#ebdedd] font-medium ml-4">
                Continue with Google
              </span>
            </Button>
          </div>
          <AuthLink
            text="Don't have an account?"
            to="/signup"
            linkText="Sign up"
          />
      </div>
    </div>
  )
}

export default LoginComponents