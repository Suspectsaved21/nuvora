
import { useState } from "react";
import { addFriendToDb } from "@/services/friendService";
import { Friend } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";

export function useAddFriend(
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>,
  userId?: string
) {
  const [isAdding, setIsAdding] = useState(false);

  const addFriend = async (targetUserId: string, userData?: { username: string; country?: string }) => {
    if (!userId) return;
    
    setIsAdding(true);
    try {
      const success = await addFriendToDb(userId, targetUserId);
      
      if (!success) {
        // Already friends
        toast({
          description: "This user is already in your friends list."
        });
        setIsAdding(false);
        return;
      }
      
      // Update local state
      const newFriend: Friend = {
        id: targetUserId,
        username: userData?.username || 'New Friend',
        status: 'online', // Setting as online initially
        blocked: false,
        country: userData?.country || 'Unknown',
        lastSeen: new Date().getTime()
      };
      
      setFriends(prevFriends => {
        const exists = prevFriends.some(friend => friend.id === targetUserId);
        if (exists) {
          return prevFriends.map(friend => 
            friend.id === targetUserId 
              ? { ...friend, status: 'online' as const, blocked: false } 
              : friend
          );
        } else {
          return [...prevFriends, newFriend];
        }
      });
    } catch (error) {
      console.error("Error adding friend:", error);
      toast({
        variant: "destructive",
        description: "Failed to add friend. Please try again."
      });
    } finally {
      setIsAdding(false);
    }
  };

  return {
    addFriend,
    isAdding
  };
}
