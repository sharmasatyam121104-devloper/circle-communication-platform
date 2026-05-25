import { IoMdCheckmark } from "react-icons/io";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { HiDocumentText } from "react-icons/hi2";
import { FiDownload } from "react-icons/fi";

type AttachmentProps = {
  fileName: string;
  fileSize: string;
  fileType: string;
  fileUrl?: string;
};

type ReceiverMessageProps = {
  message?: string;
  time: string;
  isSeen?: boolean;
  attachment?: AttachmentProps;
};

const ReceiverMessage = ({
  message,
  time,
  isSeen = false,
  attachment,
}: ReceiverMessageProps) => {
  return (
    <div className="mt-2 px-2 flex justify-end">
      <div className="bg-slate-700 text-white max-w-[320px] md:max-w-md p-3 rounded-2xl rounded-br-md shadow-lg">

        {/* Message */}
        {message && (
          <h1 className="text-[15px] leading-relaxed wrap-break-words">
            {message}
          </h1>
        )}

        {/* Attachment */}
        {attachment && (
          <div className="mt-3 bg-white/10 border border-white/10 rounded-xl p-3">
            
            <div className="flex items-center justify-between gap-3">
              
              {/* Left */}
              <div className="flex items-center gap-3 overflow-hidden">
                
                {/* File Icon */}
                <div className="bg-white/10 p-2 rounded-lg shrink-0">
                  <HiDocumentText className="text-2xl" />
                </div>

                {/* File Details */}
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">
                    {attachment.fileName}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <span>{attachment.fileType}</span>
                    <span>•</span>
                    <span>{attachment.fileSize}</span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <a
                href={attachment.fileUrl}
                download
                className="bg-white/10 hover:bg-white/20 transition p-2 rounded-lg shrink-0"
              >
                <FiDownload className="text-lg" />
              </a>
            </div>
          </div>
        )}

        {/* Bottom */}
        <div className="flex justify-end items-end mt-2">
          <div className="flex flex-col items-end">

            {/* Time */}
            <p className="text-[11px] text-slate-300">
              {time}
            </p>

            {/* Tick */}
            {isSeen ? (
              <IoCheckmarkDoneSharp className="text-blue-400 text-sm" />
            ) : (
              <IoMdCheckmark className="text-slate-300 text-sm" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverMessage;


            // <ReceiverMessage
            //   message="Bhai ye assignment file dekh"
            //   time="9:45 PM"
            //   isSeen={true}
            //   attachment={{
            //     fileName: "DBMS_Assignment.pdf",
            //     fileSize: "2.3 MB",
            //     fileType: "PDF",
            //     fileUrl: "/files/DBMS_Assignment.pdf",
            //   }}
            // />