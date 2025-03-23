
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

/**
 * Accept a friend request
 */
export async function acceptFriendRequest(currentUserId: string, friendId: string): Promise<boolean> {
  try {
    // First, check if there's a pending request from this user
    const { data: pendingRequest } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', friendId)
      .eq('friend_id', currentUserId)
      .eq('status', 'pending')
      .single();
      
    if (!pendingRequest) {
      console.log("No pending request found");
      return false;
    }
    
    // Update the status of the incoming request to active
    await supabase
      .from('friends')
      .update({ status: 'active' })
      .eq('id', pendingRequest.id);
      
    // Create the reverse relationship if it doesn't exist
    const { data: existingReverse } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', currentUserId)
      .eq('friend_id', friendId)
      .single();
      
    if (!existingReverse) {
      await supabase
        .from('friends')
        .insert({
          user_id: currentUserId,
          friend_id: friendId,
          status: 'active'
        });
    } else {
      await supabase
        .from('friends')
        .update({ status: 'active' })
        .eq('id', existingReverse.id);
    }
    
    // Send a notification to the user who sent the request
    sonnerToast.success("Friend request accepted!");
    
    return true;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    sonnerToast.error("Failed to accept friend request");
    return false;
  }
}

/**
 * Decline a friend request
 */
export async function declineFriendRequest(currentUserId: string, friendId: string): Promise<boolean> {
  try {
    // Delete the pending friend request
    await supabase
      .from('friends')
      .delete()
      .eq('user_id', friendId)
      .eq('friend_id', currentUserId)
      .eq('status', 'pending');
      
    return true;
  } catch (error) {
    console.error("Error declining friend request:", error);
    return false;
  }
}
