
import { useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatContext from "@/context/ChatContext";
import FriendList from "./friends/FriendList";
import FriendSearch from "./friends/FriendSearch";
import AuthContext from "@/context/AuthContext";

const FriendsList = () => {
  const { friends, blockUser, unfriendUser, startDirectChat, startVideoCall, addFriend, isLoading } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  
  const onlineFriends = friends.filter(friend => friend.status === "online" && !friend.blocked);
  const offlineFriends = friends.filter(friend => friend.status === "offline" && !friend.blocked);
  const blockedFriends = friends.filter(friend => friend.blocked);
  
  return (
    <div className="h-full flex flex-col bg-secondary/50 dark:bg-secondary/30 rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Friends List</h3>
      </div>
      
      <FriendSearch 
        currentUserId={user?.id} 
        onAddFriend={addFriend}
        isAdding={isLoading}
      />

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

export default FriendsList;
