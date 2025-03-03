
import { useState } from "react";
import { blockUserInDb } from "@/services/friendService";
import { Friend } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";

export function useBlockUser(
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>,
  userId?: string
) {
  const [isBlocking, setIsBlocking] = useState(false);

  const blockUser = async (targetUserId: string) => {
    if (!userId) return;
    
    setIsBlocking(true);
    try {
      const success = await blockUserInDb(userId, targetUserId);
      
      if (success) {
        // Update local state
        setFriends(prevFriends => 
          prevFriends.map(friend => 
            friend.id === targetUserId 
              ? { ...friend, status: 'blocked' as const, blocked: true } 
              : friend
          )
        );
        
        toast({
          description: "User has been blocked."
        });
      } else {
        throw new Error("Failed to block user");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      toast({
        variant: "destructive",
        description: "Failed to block user. Please try again."
      });
    } finally {
      setIsBlocking(false);
    }
  };

  return {
    blockUser,
    isBlocking
  };
}
