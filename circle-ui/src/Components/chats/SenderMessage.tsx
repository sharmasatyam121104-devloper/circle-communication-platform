
import { HiDocumentText } from "react-icons/hi2";
import { FiDownload } from "react-icons/fi";
import Avatar from "../ui/Avtar";

type AttachmentProps = {
  fileName: string;
  fileSize: string;
  fileType: string;
  fileUrl?: string;
};

type SenderMessageProps = {
  message?: string;
  time: string;
  avatar?: string;
  attachment?: AttachmentProps;
};

const SenderMessage = ({
  message,
  time,
  avatar,
  attachment,
}: SenderMessageProps) => {
  return (
    <div className="flex justify-start mt-2 px-2">
      <div className="bg-indigo-500 max-w-[320px] md:max-w-md p-3 rounded-2xl rounded-bl-md shadow-lg text-white">

        {/* Message */}
        {message && (
          <h1 className="text-[15px] leading-relaxed wrap-break-words">
            {message}
          </h1>
        )}

        {/* Attachment */}
        {attachment && (
          <div className="mt-3 bg-white/10 border border-white/20 rounded-xl p-3 backdrop-blur-sm">
            
            <div className="flex items-center justify-between gap-3">
              
              {/* Left */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-white/20 p-2 rounded-lg">
                  <HiDocumentText className="text-2xl" />
                </div>

                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">
                    {attachment.fileName}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-indigo-100">
                    <span>{attachment.fileType}</span>
                    <span>•</span>
                    <span>{attachment.fileSize}</span>
                  </div>
                </div>
              </div>

              {/* Download */}
              <a
                href={attachment.fileUrl}
                download
                className="bg-white/20 hover:bg-white/30 transition p-2 rounded-lg shrink-0"
              >
                <FiDownload className="text-lg" />
              </a>
            </div>
          </div>
        )}

        {/* Bottom */}
        <div className="flex justify-end items-end mt-2">
          <div className="flex items-end gap-2">

            {/* Avatar */}
            <Avatar src={avatar} />

            {/* Time + Tick */}
            <div className="flex flex-col items-end">
              <p className="text-[11px] text-indigo-100">
                {time}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SenderMessage;