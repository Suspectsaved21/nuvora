
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
          username
        )
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Transform the result into our Friend interface
    if (data) {
      return data.map(item => {
        // Safely access properties with type checking
        const friendData = item.friend as any;
        
        // Map database status to our Friend interface status
        let friendStatus: Friend['status'] = 'offline';
        if (item.status === 'blocked') {
          friendStatus = 'blocked';
        } else if (item.status === 'active') {
          // For now we'll set active friends as online
          friendStatus = 'online';
        } else if (item.status === 'pending') {
          friendStatus = 'offline'; // Pending friends show as offline until accepted
        }
        
        return {
          id: item.friend_id,
          username: friendData && friendData.username ? friendData.username : 'Unknown User',
          status: friendStatus,
          blocked: item.status === 'blocked',
          pending: item.status === 'pending',
          country: 'Unknown', // This would come from profiles if we had that data
          lastSeen: new Date().getTime() // This would come from a proper last seen tracking
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
