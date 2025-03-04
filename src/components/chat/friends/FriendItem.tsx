
import { MessageSquare, Video, UserX, Ban, Clock, UserCheck, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Friend } from "@/types/chat";
import { getTimeAgo } from "@/utils/dateUtils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {friend.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {!isBlockedList && (
              <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            )}
          </div>
          
          <div>
            <div className="font-medium flex items-center gap-2">
              {friend.username}
              {friend.pending && (
                <Badge variant="outline" className="text-xs py-0">Pending</Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {friend.country || "Unknown location"}
              {friend.status === 'offline' && !friend.pending && (
                <span className="ml-1 flex items-center text-xs">
                  <Clock size={10} className="mr-1" />
                  {getTimeAgo(friend.lastSeen || 0)}
                </span>
              )}
              {friend.pending && (
                <span className="ml-1 flex items-center text-xs">
                  <UserCheck size={10} className="mr-1" />
                  Waiting for response
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {!isBlockedList && !friend.pending && (
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
                <MoreHorizontal size={16} />
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
                {friend.pending ? "Cancel request" : "Remove friend"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </li>
  );
};

export default FriendItem;
