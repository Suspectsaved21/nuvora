import { MessageSquare, Video, UserX, Ban, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Friend } from "@/types/chat";
import { getTimeAgo } from "@/utils/dateUtils";

interface FriendItemProps {
  friend: Friend;
  blockUser: (id: string) => void;
  unfriendUser: (id: string) => void;
  startDirectChat: (id: string) => void;
  startVideoCall: (id: string) => void;
  isBlockedList?: boolean;
}

const FriendItem = ({
  friend,
  blockUser,
  unfriendUser,
  startDirectChat,
  startVideoCall,
  isBlockedList = false,
}: FriendItemProps) => {
  return (
    <li className="group p-3 rounded-md bg-background/50 hover:bg-accent/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-foreground font-semibold">
              {friend.username.charAt(0).toUpperCase()}
            </div>
            
            {!isBlockedList && (
              <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            )}
          </div>
          
          <div>
            <div className="font-medium">{friend.username}</div>
            <div className="text-xs text-muted-foreground">
              {friend.country || "Unknown location"}
              {friend.status === 'offline' && (
                <span className="ml-1 flex items-center text-xs">
                  <Clock size={10} className="mr-1" />
                  {getTimeAgo(friend.lastSeen || 0)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-1">
          {!isBlockedList && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => startDirectChat(friend.id)}
                title="Send message"
              >
                <MessageSquare size={16} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => startVideoCall(friend.id)}
                title="Start video call"
                disabled={friend.status === 'offline'}
              >
                <Video size={16} />
              </Button>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                  <path d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3Z" />
                  <path d="M7.5 3C8.32843 3 9 2.32843 9 1.5C9 0.671573 8.32843 0 7.5 0C6.67157 0 6 0.671573 6 1.5C6 2.32843 6.67157 3 7.5 3Z" />
                  <path d="M13.5 3C14.3284 3 15 2.32843 15 1.5C15 0.671573 14.3284 0 13.5 0C12.6716 0 12 0.671573 12 1.5C12 2.32843 12.6716 3 13.5 3Z" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isBlockedList ? (
                <DropdownMenuItem 
                  className="text-green-600 cursor-pointer"
                  onClick={() => blockUser(friend.id)}
                >
                  Unblock user
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer"
                  onClick={() => blockUser(friend.id)}
                >
                  <Ban size={16} className="mr-2" />
                  Block user
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer"
                onClick={() => unfriendUser(friend.id)}
              >
                <UserX size={16} className="mr-2" />
                Remove friend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
};

export default FriendItem;
