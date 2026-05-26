import { Plus, X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useState, type SyntheticEvent } from "react";
import clientCatchError from "../../lib/clientCatchError";

type AddChatSidebarMembersProps = {
  isAddMemberInChatModalOpen: boolean;
  setIsAddMemberInChatModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddChatSidebarMembers = ({isAddMemberInChatModalOpen, setIsAddMemberInChatModalOpen}: AddChatSidebarMembersProps) => {

    const [email, setEmail] = useState("")

    const handleAddMemberInChat = async(e: SyntheticEvent<HTMLFormElement>)=>{
      e.preventDefault()
      try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        if (!isValid) {
          throw new Error("Inavlid Email")
        }
        console.log(email);
      } 
      catch (error) {
        clientCatchError(error)  
      }
    }

  return (
    <div>
      {
        isAddMemberInChatModalOpen && 
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center ">
            <div className="bg-indigo-400 h-80 w-120 rounded-3xl flex flex-col items-center p-4">
                <h1 className="text-white text-4xl font-medium">Add Member in Chat's</h1>
                <form className="p-2 m-8" onSubmit={handleAddMemberInChat}>
                  <Input name="email" value={email} type="email" label="Email Id:" labelFont="font-medium" labelTextSize="text-xl" placeholder="Enter Member Email Id" width="w-85"
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                  <div className="mt-8 flex items-center gap-4 ">
                    <Button type="submit"  bgColor="bg-green-600" className="active:scale-75"><Plus/> Add Member</Button>
                    <Button onClick={()=>setIsAddMemberInChatModalOpen(false)} bgColor="bg-rose-600" className="active:scale-75"><X/>Cancel Now</Button>
                  </div>
                </form>
            </div>
        </div>
      }
    </div>
  )
}

export default AddChatSidebarMembers