
import { supabase } from "@/integrations/supabase/client";

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
  targetUserId: string,
  status: 'active' | 'pending' = 'pending'
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
          .update({ status })
          .eq('user_id', currentUserId)
          .eq('friend_id', targetUserId);
      } else if (existingFriend.status === 'pending' && status === 'active') {
        // Accepting a pending request
        await supabase
          .from('friends')
          .update({ status: 'active' })
          .eq('user_id', currentUserId)
          .eq('friend_id', targetUserId);
      } else {
        // Already friends or pending
        return false;
      }
    } else {
      // Insert a new friend
      await supabase
        .from('friends')
        .insert({
          user_id: currentUserId,
          friend_id: targetUserId,
          status
        });
    }
    
    return true;
  } catch (error) {
    console.error("Error adding friend:", error);
    return false;
  }
}
