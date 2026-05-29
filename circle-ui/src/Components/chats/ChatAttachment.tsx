import type { ChangeEvent } from "react";
import clientCatchError from "../../lib/clientCatchError";

type ChatAttachmentProps = {
    file: File | null;

    setFile: React.Dispatch<
        React.SetStateAction<File | null>
    >;
};

const ChatAttachment = ({setFile,}: ChatAttachmentProps) => {

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {

        try {
            const selectedFile = e.target.files?.[0];

            if (!selectedFile) return;

            const maxSize = 6 * 1024 * 1024;

            if (selectedFile.size > maxSize) {
                throw new Error(
                    "File size must be less than 6 MB"
                );
            }
            setFile(selectedFile);
            e.target.value = "";
        }catch (error) {
            return clientCatchError(error);
        }
    };

    return (

            <input
                type="file"
            className="
                absolute
                top-0
                left-0
                w-full
                h-full
                opacity-0
                cursor-pointer
            "
                onChange={handleFileChange}
            />
    );
};

export default ChatAttachment;