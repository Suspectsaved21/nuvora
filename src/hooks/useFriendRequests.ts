
import { useEffect } from "react";
import { subscribeToFriendRequests, showFriendRequestNotification } from "@/services/friendService";

export function useFriendRequests(user: any | null, refreshFriends: () => void) {
  // Set up real-time friend request notifications
  useEffect(() => {
    if (!user) return;
    
    const cleanup = subscribeToFriendRequests(user.id, (sender) => {
      showFriendRequestNotification(
        sender.id,
        sender.username,
        user.id,
        refreshFriends
      );
    });
    
    return cleanup;
  }, [user, refreshFriends]);
}
