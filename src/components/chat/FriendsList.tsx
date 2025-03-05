
import { useContext, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ChatContext from "@/context/ChatContext";
import FriendList from "./friends/FriendList";

const FriendsList = () => {
  const { friends, blockUser, unfriendUser, startDirectChat, startVideoCall, addFriend } = useContext(ChatContext);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter friends based on search query
  const filteredFriends = searchQuery 
    ? friends.filter(friend => 
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;
  
  const onlineFriends = filteredFriends.filter(friend => friend.status === "online" && !friend.blocked);
  const offlineFriends = filteredFriends.filter(friend => friend.status === "offline" && !friend.blocked);
  const blockedFriends = filteredFriends.filter(friend => friend.blocked);
  
  return (
    <div className="h-full flex flex-col bg-secondary/50 dark:bg-secondary/30 rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Friends List</h3>
      </div>
      
      <div className="p-4 border-b border-border">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="secondary" size="sm" className="whitespace-nowrap">
            Search
          </Button>
        </div>
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

export default FriendsList;
