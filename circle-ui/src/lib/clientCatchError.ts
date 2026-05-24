import axios from "axios"
import { toast } from "sonner"

interface ApiErrorResponse {
  message?: string
  error?: string
}

const clientCatchError = (error: unknown): void => {

  //  Axios Error (properly typed)
  if (axios.isAxiosError<ApiErrorResponse>(error)) {

    const serverMessage =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.response?.statusText ??
      "Server error"

    toast.error(serverMessage)
    return
  }

  // Native JS Error
  if (error instanceof Error) {
    toast.error(error.message)
    return
  }

  //Fallback
  toast.error("Internal server error")
}

export default clientCatchError