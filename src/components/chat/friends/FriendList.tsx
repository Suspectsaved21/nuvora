
import { Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Friend } from "@/types/chat";
import FriendItem from "./FriendItem";
import { getTimeAgo } from "@/utils/dateUtils";

interface FriendListProps {
  friends: Friend[];
  blockUser: (id: string) => void;
  unfriendUser: (id: string) => void;
  startDirectChat: (id: string) => void;
  startVideoCall: (id: string) => void;
  isBlockedList?: boolean;
}

const FriendList = ({ 
  friends, 
  blockUser, 
  unfriendUser, 
  startDirectChat, 
  startVideoCall,
  isBlockedList = false,
}: FriendListProps) => {
  if (friends.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground p-4">
        {isBlockedList 
          ? "No blocked users" 
          : "No friends in this category"}
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[350px] p-4">
      <ul className="space-y-2">
        {friends.map(friend => (
          <FriendItem
            key={friend.id}
            friend={friend}
            blockUser={blockUser}
            unfriendUser={unfriendUser}
            startDirectChat={startDirectChat}
            startVideoCall={startVideoCall}
            isBlockedList={isBlockedList}
          />
        ))}
      </ul>
    </ScrollArea>
  );
};

export default FriendList;
