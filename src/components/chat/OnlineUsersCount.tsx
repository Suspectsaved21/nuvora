
import { useOnlineUsersCount } from "@/hooks/useOnlineUsersCount";
import { Users, Loader2 } from "lucide-react";

interface OnlineUsersCountProps {
  className?: string;
}

const OnlineUsersCount = ({ className }: OnlineUsersCountProps) => {
  const { onlineCount, isLoading } = useOnlineUsersCount();

  return (
    <div className={`flex items-center justify-center gap-2 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white ${className}`}>
      {isLoading ? (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Counting users...</span>
        </div>
      ) : (
        <>
          <Users className="h-4 w-4 text-green-400" />
          <span className="font-medium">
            {onlineCount.toLocaleString()} {onlineCount === 1 ? 'person' : 'people'} online
          </span>
        </>
      )}
    </div>
  );
};

export default OnlineUsersCount;
