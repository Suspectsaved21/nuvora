
import { useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatContext from "@/context/ChatContext";
import FriendList from "./friends/FriendList";
import FriendSearch from "./friends/FriendSearch";
import AuthContext from "@/context/AuthContext";
import { UsersRound, UserRound, UserX2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const FriendsList = () => {
  const { friends, blockUser, unfriendUser, startDirectChat, startVideoCall, addFriend, isLoading } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  
  const onlineFriends = friends.filter(friend => friend.status === "online" && !friend.blocked);
  const offlineFriends = friends.filter(friend => friend.status === "offline" && !friend.blocked);
  const blockedFriends = friends.filter(friend => friend.blocked);
  
  return (
    <div className="h-full flex flex-col bg-secondary/50 dark:bg-secondary/30 rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold flex items-center">
          <UsersRound className="mr-2 h-4 w-4" />
          Friends
        </h3>
      </div>
      
      <FriendSearch 
        currentUserId={user?.id} 
        onAddFriend={addFriend}
        isAdding={isLoading}
      />

      <Tabs defaultValue="online" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="online" className="flex-1 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Online ({onlineFriends.length})</span>
            </TabsTrigger>
            <TabsTrigger value="offline" className="flex-1 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
              <span>Offline ({offlineFriends.length})</span>
            </TabsTrigger>
            <TabsTrigger value="blocked" className="flex-1 flex items-center gap-1.5">
              <UserX2 className="h-3.5 w-3.5" />
              <span>Blocked ({blockedFriends.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="online" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <FriendList 
              friends={onlineFriends} 
              blockUser={blockUser} 
              unfriendUser={unfriendUser} 
              startDirectChat={startDirectChat} 
              startVideoCall={startVideoCall} 
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="offline" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <FriendList 
              friends={offlineFriends} 
              blockUser={blockUser} 
              unfriendUser={unfriendUser} 
              startDirectChat={startDirectChat} 
              startVideoCall={startVideoCall} 
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="blocked" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <FriendList 
              friends={blockedFriends} 
              blockUser={blockUser} 
              unfriendUser={unfriendUser} 
              startDirectChat={startDirectChat} 
              startVideoCall={startVideoCall}
              isBlockedList
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FriendsList;
