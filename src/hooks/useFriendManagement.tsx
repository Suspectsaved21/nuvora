
import { useState, useEffect, useContext } from "react";
import { Friend } from "@/types/chat";
import AuthContext from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useFriendManagement() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const { user } = useContext(AuthContext);

  // Fetch friends on mount and when user changes
  useEffect(() => {
    if (!user) return;
    
    const fetchFriends = async () => {
      try {
        const { data, error } = await supabase
          .from('friends')
          .select(`
            *,
            friend:friend_id (
              id,
              username
            )
          `)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Transform the result into our Friend interface
        if (data) {
          const transformedFriends = data.map(item => {
            // Safely access properties with type checking
            const friendData = item.friend as any;
            
            // Map database status to our Friend interface status
            let friendStatus: Friend['status'] = 'offline';
            if (item.status === 'blocked') {
              friendStatus = 'blocked';
            } else if (item.status === 'active') {
              // For now we'll set active friends as online
              // This would be updated with real online status later
              friendStatus = 'online';
            }
            
            return {
              id: item.friend_id,
              username: friendData && friendData.username ? friendData.username : 'Unknown User',
              status: friendStatus,
              blocked: item.status === 'blocked',
              country: 'Unknown', // This would come from profiles if we had that data
              lastSeen: new Date().getTime() // This would come from a proper last seen tracking
            } as Friend;
          });
          
          setFriends(transformedFriends);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        toast({
          variant: "destructive",
          description: "Failed to load friends list. Please try again."
        });
      }
    };
    
    fetchFriends();
  }, [user]);

  const blockUser = async (userId: string) => {
    if (!user) return;
    
    try {
      // Check if the friend already exists
      const { data: existingFriend } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user.id)
        .eq('friend_id', userId)
        .single();
      
      if (existingFriend) {
        // Update the status to blocked
        await supabase
          .from('friends')
          .update({ status: 'blocked' })
          .eq('user_id', user.id)
          .eq('friend_id', userId);
      } else {
        // Insert a new friend with blocked status
        await supabase
          .from('friends')
          .insert({
            user_id: user.id,
            friend_id: userId,
            status: 'blocked'
          });
      }
      
      // Update local state
      setFriends(prevFriends => 
        prevFriends.map(friend => 
          friend.id === userId 
            ? { ...friend, status: 'blocked' as const, blocked: true } 
            : friend
        )
      );
      
      toast({
        description: "User has been blocked."
      });
    } catch (error) {
      console.error("Error blocking user:", error);
      toast({
        variant: "destructive",
        description: "Failed to block user. Please try again."
      });
    }
  };

  const unfriendUser = async (userId: string) => {
    if (!user) return;
    
    try {
      // Delete the friend relationship
      await supabase
        .from('friends')
        .delete()
        .eq('user_id', user.id)
        .eq('friend_id', userId);
      
      // Update local state
      setFriends(prevFriends => 
        prevFriends.filter(friend => friend.id !== userId)
      );
      
      toast({
        description: "User has been removed from your friends list."
      });
    } catch (error) {
      console.error("Error unfriending user:", error);
      toast({
        variant: "destructive",
        description: "Failed to remove friend. Please try again."
      });
    }
  };

  const addFriend = async (userId: string, userData?: { username: string; country?: string }) => {
    if (!user) return;
    
    try {
      // Check if the friend already exists
      const { data: existingFriend } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user.id)
        .eq('friend_id', userId)
        .single();
      
      if (existingFriend) {
        // If blocked, unblock them
        if (existingFriend.status === 'blocked') {
          await supabase
            .from('friends')
            .update({ status: 'active' })
            .eq('user_id', user.id)
            .eq('friend_id', userId);
        } else {
          // Already friends
          toast({
            description: "This user is already in your friends list."
          });
          return;
        }
      } else {
        // Insert a new friend
        await supabase
          .from('friends')
          .insert({
            user_id: user.id,
            friend_id: userId,
            status: 'active'
          });
      }
      
      // Update local state
      const newFriend: Friend = {
        id: userId,
        username: userData?.username || 'New Friend',
        status: 'online', // Setting as online initially
        blocked: false,
        country: userData?.country || 'Unknown',
        lastSeen: new Date().getTime()
      };
      
      setFriends(prevFriends => {
        const exists = prevFriends.some(friend => friend.id === userId);
        if (exists) {
          return prevFriends.map(friend => 
            friend.id === userId 
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
    }
  };

  return {
    friends,
    blockUser,
    unfriendUser,
    addFriend
  };
}
