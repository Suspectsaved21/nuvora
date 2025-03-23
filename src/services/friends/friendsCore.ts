
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";

/**
 * Fetches friends list for a user from the database
 */
export async function fetchFriendsList(userId: string): Promise<Friend[]> {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select(`
        *,
        friend:friend_id (
          id,
          username,
          country,
          online_status,
          last_seen_at
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Transform the result into our Friend interface
    if (data) {
      return data.map(item => {
        // Safely access properties with type checking
        const friendData = item.friend as any;
        
        // Determine friend status based on online_status from profiles
        let friendStatus: Friend['status'] = 'offline';
        if (item.status === 'blocked') {
          friendStatus = 'blocked';
        } else if (item.status === 'active') {
          // Check if they're online using the online_status field
          friendStatus = friendData?.online_status ? 'online' : 'offline';
        } else if (item.status === 'pending') {
          // Pending friends can still show their online status
          friendStatus = friendData?.online_status ? 'online' : 'offline';
        }
        
        return {
          id: item.friend_id,
          username: friendData && friendData.username ? friendData.username : 'Unknown User',
          status: friendStatus,
          blocked: item.status === 'blocked',
          pending: item.status === 'pending',
          country: friendData?.country || 'Unknown',
          lastSeen: friendData?.last_seen_at ? new Date(friendData.last_seen_at).getTime() : new Date().getTime()
        } as Friend;
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching friends:", error);
    toast({
      variant: "destructive",
      description: "Failed to load friends list. Please try again."
    });
    return [];
  }
}

/**
 * Subscribe to real-time updates for friends' online status
 */
export function subscribeFriendsOnlineStatus(userId: string, onStatusUpdate: () => void) {
  // Set up subscription for profiles table updates
  const channel = supabase
    .channel('friends-status-updates')
    .on('postgres_changes', 
        {
          event: '*',  // Listen for all changes
          schema: 'public',
          table: 'profiles'
        }, 
        () => {
          // When any profile changes, refresh friends list
          onStatusUpdate();
        })
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
}
