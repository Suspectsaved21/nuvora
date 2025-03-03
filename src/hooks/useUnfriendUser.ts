
import { useState } from "react";
import { removeFriendFromDb } from "@/services/friendService";
import { Friend } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";

export function useUnfriendUser(
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>,
  userId?: string
) {
  const [isUnfriending, setIsUnfriending] = useState(false);

  const unfriendUser = async (targetUserId: string) => {
    if (!userId) return;
    
    setIsUnfriending(true);
    try {
      const success = await removeFriendFromDb(userId, targetUserId);
      
      if (success) {
        // Update local state
        setFriends(prevFriends => 
          prevFriends.filter(friend => friend.id !== targetUserId)
        );
        
        toast({
          description: "User has been removed from your friends list."
        });
      } else {
        throw new Error("Failed to remove friend");
      }
    } catch (error) {
      console.error("Error unfriending user:", error);
      toast({
        variant: "destructive",
        description: "Failed to remove friend. Please try again."
      });
    } finally {
      setIsUnfriending(false);
    }
  };

  return {
    unfriendUser,
    isUnfriending
  };
}
