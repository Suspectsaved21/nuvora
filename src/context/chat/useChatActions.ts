
import { useCallback } from "react";
import { Friend, Partner } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { User } from "@/types/auth";

// This hook provides all the actions for the chat context
export function useChatActions(state: any, user: User | null) {
  // Wrapper function to find a new partner
  const findNewPartner = useCallback(() => {
    state.findPartner();
  }, [state.findPartner]);

  // Wrapper function to send a message
  const sendMessage = useCallback((text: string) => {
    if (!user) return;
    state.sendPartnerMessage(text, user.id);
  }, [user, state.sendPartnerMessage]);

  // Function to start a direct chat with a friend
  const startDirectChat = useCallback((userId: string) => {
    const friend = state.friends.find((f: Friend) => f.id === userId);
    if (friend && !friend.blocked && !friend.pending) {
      state.initDirectChat(friend.id, friend.username, friend.country);
    } else if (friend && friend.pending) {
      sonnerToast.error("Cannot chat with pending friend. Wait for them to accept your request.");
    } else {
      toast({
        variant: "destructive",
        description: "Could not start chat with this user."
      });
    }
  }, [state.friends, state.initDirectChat]);

  // Function to start a video call with a friend
  const startVideoCall = useCallback((userId: string) => {
    const friend = state.friends.find((f: Friend) => f.id === userId);
    if (friend && !friend.blocked && !friend.pending && friend.status === 'online') {
      state.initVideoCall(friend.id, friend.username, friend.country);
    } else if (friend && friend.pending) {
      sonnerToast.error("Cannot call pending friend. Wait for them to accept your request.");
    } else if (friend && friend.status !== 'online') {
      sonnerToast.error("User is not online. Try again when they're online.");
    } else {
      toast({
        variant: "destructive",
        description: "Could not start video call with this user."
      });
    }
  }, [state.friends, state.initVideoCall]);

  // Enhanced friend request functionality
  const addFriend = useCallback((userId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "You need to be logged in to add friends."
      });
      return;
    }
    
    if (state.partner && state.partner.id === userId) {
      // Add friend to the list
      state.addFriendToList(userId, {
        username: state.partner.username,
        country: state.partner.country,
      });
      
      // Show success notification
      sonnerToast.success(`Friend request sent to ${state.partner.username}`);
      
      // Send a system message in the chat
      const systemMessage = {
        id: Math.random().toString(),
        sender: "system",
        text: `You sent a friend request to ${state.partner.username}.`,
        timestamp: Date.now(),
        isOwn: false,
      };
      
      // Add the system message to the chat
      // Handled by the usePartnerMessaging hook automatically
    }
  }, [user, state.partner, state.addFriendToList]);

  return {
    // Wrap all actions for the context
    findNewPartner,
    sendMessage,
    sendGameAction: state.sendGameAction,
    setIsTyping: state.setIsTyping,
    reportPartner: state.reportPartner,
    blockUser: state.blockUser,
    unfriendUser: state.unfriendUser,
    startDirectChat,
    startVideoCall,
    addFriend,
    toggleLocationTracking: state.toggleLocationTracking,
    refreshLocation: state.refreshLocation
  };
}
