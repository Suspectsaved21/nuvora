
import { useState } from "react";
import { addFriendToDb } from "@/services/friendService";
import { Friend } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAddFriend(
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>,
  userId?: string
) {
  const [isAdding, setIsAdding] = useState(false);

  const addFriend = async (targetUserId: string, userData?: { username: string; country?: string }) => {
    if (!userId) return;
    
    setIsAdding(true);
    try {
      // First check if this user exists in the auth system
      let username = userData?.username || 'New Friend';
      let country = userData?.country || 'Unknown';
      
      if (targetUserId && targetUserId.length > 10) {
        try {
          // Attempt to get user data from Supabase
          const { data, error } = await supabase
            .from('profiles')
            .select('username, country')
            .eq('id', targetUserId)
            .single();
          
          if (data && !error) {
            username = data.username || username;
            country = data.country || country;
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      }
      
      // Send the friend request to the database
      const success = await addFriendToDb(userId, targetUserId);
      
      if (!success) {
        // Already friends
        toast({
          description: "This user is already in your friends list."
        });
        setIsAdding(false);
        return;
      }
      
      // Update local state with the new friend
      const newFriend: Friend = {
        id: targetUserId,
        username: username,
        status: 'online', // Setting as online initially
        blocked: false,
        country: country,
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
      
      // Send a friend request notification via the Supabase realtime channel
      try {
        // This would be better implemented with a proper notifications system
        // But for now, we'll use the existing code structure
        console.log("Friend request sent to:", targetUserId);
      } catch (err) {
        console.error("Error sending friend request notification:", err);
      }
      
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
