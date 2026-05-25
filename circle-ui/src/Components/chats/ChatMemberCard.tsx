import Avatar from "../ui/Avtar";

type ChatMemberCardProps = {
  name: string;
  lastMessage: string;
  avatar?: string;
  unreadCount?: number;
  isOnline?: boolean;
  onClick?: () => void;
};

const ChatMemberCard = ({
  name,
  lastMessage,
  avatar,
  unreadCount = 0,
  isOnline = false,
  onClick,
}: ChatMemberCardProps) => {
  return (
    <div
      onClick={onClick}
      className="h-16 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-all duration-200 text-white flex items-center gap-3 px-4 cursor-pointer shadow-md mt-1"
    >
      
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar src={avatar} />

        {/* Online Dot */}
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-slate-800" />
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 overflow-hidden">
        <h1 className="capitalize font-medium truncate text-[15px]">
          {name}
        </h1>

        <p className="text-sm text-gray-400 truncate">
          {lastMessage}
        </p>
      </div>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <div className="bg-green-500 min-w-6 h-6 px-1 rounded-full flex justify-center items-center text-xs font-semibold">
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
    </div>
  );
};

export default ChatMemberCard;