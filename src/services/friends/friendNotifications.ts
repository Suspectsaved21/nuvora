
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";
import { acceptFriendRequest, declineFriendRequest } from "./friendRequests";

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
  // Instead of trying to use React elements in a .ts file, 
  // use the text-based notification approach that Sonner provides
  sonnerToast(`Friend request from ${senderName}`, {
    duration: 10000,
    id: `friend-request-${senderId}`,
    description: "Would you like to accept this friend request?",
    action: {
      label: "Accept",
      onClick: async () => {
        const success = await acceptFriendRequest(currentUserId, senderId);
        if (success) {
          sonnerToast.success(`You are now friends with ${senderName}`);
          onAccepted();
        } else {
          sonnerToast.error("Failed to accept friend request");
        }
      }
    },
    cancel: {
      label: "Decline",
      onClick: async () => {
        await declineFriendRequest(currentUserId, senderId);
      }
    }
  });
}
