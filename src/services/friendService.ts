
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import FriendRequestNotification from "@/components/chat/friends/FriendRequestNotification";

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
    
    return true;
  } catch (error) {
    console.error("Error accepting friend request:", error);
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

/**
 * Setup realtime subscription for friend requests
 */
export function subscribeToFriendRequests(userId: string, onNewRequest: (sender: any) => void) {
  const channel = supabase
    .channel('friend-requests')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'friends',
        filter: `friend_id=eq.${userId}`
      },
      async (payload) => {
        // Only handle pending requests
        if (payload.new && payload.new.status === 'pending') {
          try {
            // Get sender information
            const { data: sender } = await supabase
              .from('profiles')
              .select('id, username')
              .eq('id', payload.new.user_id)
              .single();
              
            if (sender) {
              onNewRequest(sender);
            }
          } catch (err) {
            console.error("Error getting sender info:", err);
          }
        }
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Show a friend request notification using Sonner
 */
export function showFriendRequestNotification(
  senderId: string, 
  senderName: string,
  currentUserId: string,
  onAccepted: () => void
) {
  sonnerToast.custom((toast) => (
    <FriendRequestNotification
      senderId={senderId}
      senderName={senderName}
      onAccept={async () => {
        const success = await acceptFriendRequest(currentUserId, senderId);
        if (success) {
          sonnerToast.success(`You are now friends with ${senderName}`);
          onAccepted();
        } else {
          sonnerToast.error("Failed to accept friend request");
        }
        sonnerToast.dismiss(toast);
      }}
      onDecline={async () => {
        await declineFriendRequest(currentUserId, senderId);
        sonnerToast.dismiss(toast);
      }}
    />
  ), {
    duration: 10000,
    id: `friend-request-${senderId}`,
  });
}
