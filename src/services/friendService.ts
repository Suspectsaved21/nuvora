
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
 * Blocks a user
 */
export async function blockUserInDb(currentUserId: string, targetUserId: string): Promise<boolean> {
  try {
    // Check if the friend already exists
    const { data: existingFriend } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', currentUserId)
      .eq('friend_id', targetUserId)
      .single();
    
    if (existingFriend) {
      // Update the status to blocked
      await supabase
        .from('friends')
        .update({ status: 'blocked' })
        .eq('user_id', currentUserId)
        .eq('friend_id', targetUserId);
    } else {
      // Insert a new friend with blocked status
      await supabase
        .from('friends')
        .insert({
          user_id: currentUserId,
          friend_id: targetUserId,
          status: 'blocked'
        });
    }
    
    return true;
  } catch (error) {
    console.error("Error blocking user:", error);
    return false;
  }
}

/**
 * Removes a friend relationship
 */
export async function removeFriendFromDb(currentUserId: string, targetUserId: string): Promise<boolean> {
  try {
    // Delete the friend relationship
    await supabase
      .from('friends')
      .delete()
      .eq('user_id', currentUserId)
      .eq('friend_id', targetUserId);
    
    return true;
  } catch (error) {
    console.error("Error unfriending user:", error);
    return false;
  }
}

/**
 * Adds a friend or unblocks them if they were blocked
 */
export async function addFriendToDb(
  currentUserId: string, 
  targetUserId: string
): Promise<boolean> {
  try {
    // Check if the friend already exists
    const { data: existingFriend } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', currentUserId)
      .eq('friend_id', targetUserId)
      .single();
    
    if (existingFriend) {
      // If blocked, unblock them
      if (existingFriend.status === 'blocked') {
        await supabase
          .from('friends')
          .update({ status: 'active' })
          .eq('user_id', currentUserId)
          .eq('friend_id', targetUserId);
      } else {
        // Already friends
        return false;
      }
    } else {
      // Insert a new friend
      await supabase
        .from('friends')
        .insert({
          user_id: currentUserId,
          friend_id: targetUserId,
          status: 'active'
        });
    }
    
    return true;
  } catch (error) {
    console.error("Error adding friend:", error);
    return false;
  }
}
