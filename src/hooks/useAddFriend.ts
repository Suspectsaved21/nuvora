
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
      
      // Send the friend request to the database (as pending)
      const success = await addFriendToDb(userId, targetUserId, 'pending');
      
      if (!success) {
        // Already friends or pending
        toast({
          description: "You already have a pending or active friend request with this user."
        });
        setIsAdding(false);
        return;
      }
      
      // Update local state with the new friend as pending
      const newFriend: Friend = {
        id: targetUserId,
        username: username,
        status: 'offline', // Pending friends are shown as offline
        blocked: false,
        pending: true,
        country: country,
        lastSeen: new Date().getTime()
      };
      
      setFriends(prevFriends => {
        const exists = prevFriends.some(friend => friend.id === targetUserId);
        if (exists) {
          return prevFriends.map(friend => 
            friend.id === targetUserId 
              ? { ...friend, status: 'offline' as const, blocked: false, pending: true } 
              : friend
          );
        } else {
          return [...prevFriends, newFriend];
        }
      });
      
      // Success message
      toast({
        description: `Friend request sent to ${username}.`
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
