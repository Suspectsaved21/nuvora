
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useAddFriend } from "@/hooks/useAddFriend";
import AuthContext from "@/context/AuthContext";
import ChatContext from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus, MessageSquare, Video, Globe, ChevronRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const OnlineUsersList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { onlineUsers, isLoading } = useOnlineUsers();
  const { addFriend, isAdding } = useAddFriend((prevFriends) => prevFriends, user?.id);
  const { startDirectChat, startVideoCall } = useContext(ChatContext);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Handle adding a friend
  const handleAddFriend = (userId: string, userData: any) => {
    addFriend(userId, userData);
    toast({
      description: `${userData.username} added to your friends list.`
    });
  };

  // Handle starting a chat
  const handleStartChat = (userId: string, username: string) => {
    startDirectChat(userId);
    navigate('/chat');
    toast({
      description: `Starting chat with ${username}`
    });
  };

  // Handle starting a video call
  const handleStartVideoCall = (userId: string, username: string) => {
    startVideoCall(userId);
    navigate('/chat');
    toast({
      description: `Starting video call with ${username}`
    });
  };

  // Handle clicking on a user
  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-background/60 animate-pulse">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No users state
  if (onlineUsers.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Online Users</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          There are no other users online right now. Check back later or invite some friends!
        </p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[600px] pr-4 -mr-4">
        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
          {onlineUsers.map((onlineUser) => (
            <div 
              key={onlineUser.id} 
              className="flex items-center justify-between p-4 rounded-lg bg-background/60 hover:bg-accent/20 transition-colors cursor-pointer"
              onClick={() => handleUserClick(onlineUser)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-foreground font-semibold">
                    {onlineUser.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                </div>
                
                <div>
                  <h3 className="font-medium">{onlineUser.username}</h3>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Globe className="h-3 w-3 mr-1" />
                    {onlineUser.country || "Unknown location"}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User action dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect with {selectedUser?.username}</DialogTitle>
          </DialogHeader>
          
          <div className="flex justify-center py-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-foreground text-3xl font-semibold">
              {selectedUser?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mt-4">
            <Button 
              onClick={() => {
                handleStartVideoCall(selectedUser.id, selectedUser.username);
                setIsDialogOpen(false);
              }}
              className="flex items-center justify-center gap-2"
            >
              <Video className="h-4 w-4" />
              Video Chat
            </Button>
            
            <Button 
              onClick={() => {
                handleStartChat(selectedUser.id, selectedUser.username);
                setIsDialogOpen(false);
              }}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Text Chat
            </Button>
            
            <Button 
              onClick={() => {
                handleAddFriend(selectedUser.id, {
                  username: selectedUser.username,
                  country: selectedUser.country
                });
                setIsDialogOpen(false);
              }}
              variant="secondary"
              className="flex items-center justify-center gap-2"
              disabled={isAdding}
            >
              <UserPlus className="h-4 w-4" />
              Add Friend
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OnlineUsersList;
