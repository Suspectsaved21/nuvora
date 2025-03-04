
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";
import { acceptFriendRequest, declineFriendRequest } from "./friendRequests";
import React from "react";

/**
 * Setup realtime subscription for friend requests
 */
export function subscribeToFriendRequests(userId: string, onNewRequest: (sender: any) => void) {
  // Enable realtime for the friends table
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
              .select('id, username, country')
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
  sonnerToast.custom(
    (id) => (
      <div className="bg-background border border-border rounded-lg p-4 shadow-lg w-full max-w-md">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {senderName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="font-semibold mb-1">Friend Request</div>
            <p className="text-sm text-muted-foreground mb-3">
              {senderName} would like to add you as a friend
            </p>
            <div className="flex gap-2">
              <button 
                onClick={async () => {
                  const success = await acceptFriendRequest(currentUserId, senderId);
                  sonnerToast.dismiss(id);
                  if (success) {
                    onAccepted();
                  } else {
                    sonnerToast.error("Failed to accept friend request");
                  }
                }}
                className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium"
              >
                Accept
              </button>
              <button 
                onClick={async () => {
                  await declineFriendRequest(currentUserId, senderId);
                  sonnerToast.dismiss(id);
                  sonnerToast.error(`Friend request from ${senderName} declined`);
                }}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm font-medium"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      id: `friend-request-${senderId}`,
      duration: 10000,
    }
  );
}
