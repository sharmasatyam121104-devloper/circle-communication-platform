import Avatar from "../ui/Avtar";

type ChatMemberCardProps = {
  name: string;
  lastMessage: string;
  avatar?: string;
  unreadCount?: number;
  isOnline?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
};

const ChatMemberCard = ({
  name,
  lastMessage,
  avatar,
  unreadCount = 0,
  isOnline = false,
  onClick,
  isOpen = false
}: ChatMemberCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-4 h-16 mt-1 rounded-2xl
        cursor-pointer overflow-hidden
        border transition-all duration-300
        ${
          isOpen
            ? "bg-gradient-to-r from-indigo-600/25 via-indigo-500/20 to-purple-600/15 border-indigo-500/50 shadow-lg shadow-indigo-500/20 scale-[1.02]"
            : "bg-slate-800 border-transparent hover:bg-slate-700 hover:border-slate-600"
        }
      `}
    >
      {/* Active Indicator */}
      {isOpen && (
        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-400" />
      )}

      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className={`rounded-full transition-all duration-300 ${
            isOpen ? "ring-2 ring-indigo-300 ring-offset-1 ring-offset-slate-700" : ""
          }`}
        >
          <Avatar src={avatar} />
        </div>

        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 bg-green-500" />
        )}
      </div>

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <h1
          className={`truncate text-[15px] capitalize transition-colors ${
            isOpen ? "font-semibold text-white" : "font-medium text-slate-100"
          }`}
        >
          {name}
        </h1>

        <p
          className={`truncate text-sm ${
            isOpen ? "text-slate-300" : "text-slate-400"
          }`}
        >
          {lastMessage}
        </p>
      </div>

      {/* Unread */}
      {unreadCount > 0 && (
        <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-500 px-2 text-xs font-semibold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
    </div>
  );
};

export default ChatMemberCard;