import { useEffect } from "react";

type NotificationPopupProps = {
    name: string;
    message: string;
    time: string;
    profileImage?: string;
    onClose: () => void;
    onClick?: () => void;
    className?: string;
};

const NotificationPopup = ({
    name,
    message,
    time,
    profileImage,
    onClose,
    onClick,
    className = "",
}: NotificationPopupProps) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 8000);

        return () => clearTimeout(timer);
    }, [onClose]);

    useEffect(() => {
        const audio = new Audio("/notification.mp3");

        audio.play().catch(console.error);

        const stopAudio = setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, 1000);

        const timer = setTimeout(onClose, 4000);

        return () => {
            clearTimeout(stopAudio);
            clearTimeout(timer);

            audio.pause();
            audio.currentTime = 0;
        };
    }, [onClose]);

    return (
        <div
            className={`fixed z-50 ${className}`}
        >
            <div
                onClick={onClick}
                className="
                    w-88
                    bg-zinc-800
                    text-white
                    rounded-xl
                    shadow-2xl
                    border border-zinc-700
                    p-4
                    cursor-pointer
                    hover:bg-zinc-700
                    transition-all
                "
            >
                <div className="flex items-start gap-3">

                    <img
                        src={profileImage}
                        alt={name}
                        className="
                            w-12 h-12
                            rounded-full
                            object-cover
                            border border-zinc-600
                        "
                    />

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold truncate">
                                {name}
                            </h3>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="text-zinc-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-sm text-zinc-300 truncate mt-1">
                            {message}
                        </p>

                        <small className="text-zinc-500">
                            {new Date(time).toLocaleTimeString()}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;