
import { useEffect } from "react";
import { subscribeToFriendRequests, showFriendRequestNotification } from "@/services/friendService";
import { toast as sonnerToast } from "sonner";

export function useFriendRequests(user: any | null, refreshFriends: () => void) {
  // Set up real-time friend request notifications
  useEffect(() => {
    if (!user) return;
    
    const cleanup = subscribeToFriendRequests(user.id, (sender) => {
      showFriendRequestNotification(
        sender.id,
        sender.username,
        user.id,
        () => {
          // Refresh friends list after accepting
          refreshFriends();
          // Show success notification
          sonnerToast.success(`You are now friends with ${sender.username}!`);
        }
      );
    });
    
    return cleanup;
  }, [user, refreshFriends]);
}
