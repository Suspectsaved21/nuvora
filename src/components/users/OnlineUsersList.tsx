
import { useContext } from "react";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useAddFriend } from "@/hooks/useAddFriend";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, Clock } from "lucide-react";

const OnlineUsersList = () => {
  const { user } = useContext(AuthContext);
  const { onlineUsers, isLoading } = useOnlineUsers();
  const { addFriend, isAdding } = useAddFriend((prevFriends) => prevFriends, user?.id);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (onlineUsers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No users are currently online.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4 pr-4">
        {onlineUsers.map((onlineUser) => (
          <div 
            key={onlineUser.id} 
            className="flex items-center justify-between p-4 rounded-lg bg-background/60 hover:bg-accent/20 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-foreground font-semibold">
                  {onlineUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
              </div>
              
              <div>
                <h3 className="font-medium">{onlineUser.username}</h3>
                <p className="text-xs text-muted-foreground">
                  {onlineUser.country || "Unknown location"}
                </p>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addFriend(onlineUser.id, { 
                username: onlineUser.username,
                country: onlineUser.country
              })}
              disabled={isAdding}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Friend
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default OnlineUsersList;
