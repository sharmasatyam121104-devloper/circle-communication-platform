import ReceiverMessage from "./ReciverMessage"
import SenderMessage from "./SenderMessage"

type MessageAreaProps = {
    openChatId: string
}

const MessageArea = ({openChatId}: MessageAreaProps) => {
    console.log("openChatId", openChatId);
  return (
    <div className="lg:h-140 h-[80vh] overflow-y-auto">
        <SenderMessage
            message="Bhai ye project report dekh"
            time="9:12 PM"
            isSeen={true}
            avatar="https://i.pravatar.cc/150?img=5"
            attachment={{
            fileName: "MERN_Project_Report.pdf",
            fileSize: "2.4 MB",
            fileType: "PDF",
            fileUrl: "/files/report.pdf",
            }}
        />
        <ReceiverMessage
            message="Bhai message receive ho gaya"
            time="9:12 PM"
            isSeen={true}
        />
    </div>
  )
}

export default MessageArea