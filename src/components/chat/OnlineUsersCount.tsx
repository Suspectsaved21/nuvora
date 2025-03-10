
import { useOnlineUsersCount } from "@/hooks/useOnlineUsersCount";
import { Users, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface OnlineUsersCountProps {
  className?: string;
}

const OnlineUsersCount = ({ className }: OnlineUsersCountProps) => {
  const { onlineCount, isLoading } = useOnlineUsersCount();
  const isMobile = useIsMobile();

  return (
    <div className={`flex items-center justify-center gap-2 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white ${className} ${isMobile ? 'text-xs' : 'text-sm'}`}>
      {isLoading ? (
        <div className="flex items-center">
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-green-400`} />
          <span className="font-medium">
            {onlineCount.toLocaleString()} {onlineCount === 1 ? 'person' : 'people'} online
          </span>
        </>
      )}
    </div>
  );
};

export default OnlineUsersCount;
