import { Home } from "lucide-react"
import Input from "./Components/ui/Input"

const App = () => {
  return (
    <div className="m-20  ">
      <Input type="password"
        icon=<Home/>
        label="home"
        

      />
    </div>
  )
}

export default App