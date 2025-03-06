
import { useOnlineUsersCount } from "@/hooks/useOnlineUsersCount";
import { Loader2 } from "lucide-react";

interface OnlineUsersCountProps {
  className?: string;
}

const OnlineUsersCount = ({ className }: OnlineUsersCountProps) => {
  const { onlineCount, isLoading } = useOnlineUsersCount();

  return (
    <div className={`flex items-center justify-center text-sm ${className}`}>
      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
      {isLoading ? (
        <div className="flex items-center">
          <Loader2 className="h-3 w-3 animate-spin mr-2" />
          <span>Counting online users...</span>
        </div>
      ) : (
        <span>
          {onlineCount.toLocaleString()} {onlineCount === 1 ? 'person is' : 'people are'} online and ready to chat!
        </span>
      )}
    </div>
  );
};

export default OnlineUsersCount;
