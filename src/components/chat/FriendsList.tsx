
import { useContext } from "react";
import { MessageSquare, Video, UserX, Ban, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatContext, { Friend } from "@/context/ChatContext";

const FriendsList = () => {
  const { friends, blockUser, unfriendUser, startDirectChat, startVideoCall } = useContext(ChatContext);
  
  const onlineFriends = friends.filter(friend => friend.status === "online" && !friend.blocked);
  const offlineFriends = friends.filter(friend => friend.status === "offline" && !friend.blocked);
  const blockedFriends = friends.filter(friend => friend.blocked);
  
  return (
    <div className="h-full flex flex-col bg-secondary/50 dark:bg-secondary/30 rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Friends List</h3>
      </div>
      
      <Tabs defaultValue="online" className="flex-1">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="online" className="flex-1">
              Online ({onlineFriends.length})
            </TabsTrigger>
            <TabsTrigger value="offline" className="flex-1">
              Offline ({offlineFriends.length})
            </TabsTrigger>
            <TabsTrigger value="blocked" className="flex-1">
              Blocked ({blockedFriends.length})
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="online" className="flex-1 m-0">
          <FriendList 
            friends={onlineFriends} 
            blockUser={blockUser} 
            unfriendUser={unfriendUser} 
            startDirectChat={startDirectChat} 
            startVideoCall={startVideoCall}
          />
        </TabsContent>
        
        <TabsContent value="offline" className="flex-1 m-0">
          <FriendList 
            friends={offlineFriends} 
            blockUser={blockUser} 
            unfriendUser={unfriendUser} 
            startDirectChat={startDirectChat} 
            startVideoCall={startVideoCall}
          />
        </TabsContent>
        
        <TabsContent value="blocked" className="flex-1 m-0">
          <FriendList 
            friends={blockedFriends} 
            blockUser={blockUser} 
            unfriendUser={unfriendUser} 
            startDirectChat={startDirectChat} 
            startVideoCall={startVideoCall}
            isBlockedList
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

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
          <li key={friend.id} className="group p-3 rounded-md bg-background/50 hover:bg-accent/30 transition-colors">
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
        ))}
      </ul>
    </ScrollArea>
  );
};

// Helper function to format time ago
const getTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default FriendsList;
