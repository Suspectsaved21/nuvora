
import { useEffect } from "react";
import { subscribeToFriendRequests, showFriendRequestNotification } from "@/services/friendService";
import { toast as sonnerToast } from "sonner";

export function useFriendRequests(user: any | null, refreshFriends: () => void) {
  // Set up real-time friend request notifications
  useEffect(() => {
    if (!user) return;
    
    // Play a notification sound when receiving a friend request
    const playNotificationSound = () => {
      try {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.5;
        audio.play().catch(err => console.error("Failed to play notification sound:", err));
      } catch (error) {
        console.error("Error playing notification sound:", error);
      }
    };
    
    const cleanup = subscribeToFriendRequests(user.id, (sender) => {
      // Play notification sound
      playNotificationSound();
      
      // Show the friend request notification
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
