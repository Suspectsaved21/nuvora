
import { useEffect } from "react";
import { User } from "@/types/auth";
import { subscribeToFriendRequests, showFriendRequestNotification } from "@/services/friends/index";

export function useFriendRequests(user: User | null, refreshFriends: () => void) {
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
  
  // No return value needed as this is just for side effects
}
