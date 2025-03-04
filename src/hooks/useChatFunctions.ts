
import { useState } from "react";
import { Friend, Partner } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { sonnerToast } from "sonner";

export function useChatFunctions(
  user: any | null,
  partner: Partner | null, 
  friends: Friend[],
  addFriendToList: (userId: string, userData?: { username: string; country?: string }) => void
) {
  // Wrapper functions to connect different hooks together
  const sendMessage = (text: string, sendPartnerMessage: (text: string, userId: string) => void) => {
    if (!user) return;
    sendPartnerMessage(text, user.id);
  };

  const startDirectChat = (
    userId: string, 
    initDirectChat: (userId: string, username: string, country?: string) => any
  ) => {
    const friend = friends.find(f => f.id === userId);
    if (friend && !friend.blocked) {
      initDirectChat(friend.id, friend.username, friend.country);
    } else {
      toast({
        variant: "destructive",
        description: "Could not start chat with this user."
      });
    }
  };

  const startVideoCall = (
    userId: string, 
    initVideoCall: (userId: string, username: string, country?: string) => any
  ) => {
    const friend = friends.find(f => f.id === userId);
    if (friend && !friend.blocked) {
      initVideoCall(friend.id, friend.username, friend.country);
    } else {
      toast({
        variant: "destructive",
        description: "Could not start video call with this user."
      });
    }
  };

  // Enhanced friend request functionality
  const addFriend = (userId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "You need to be logged in to add friends."
      });
      return;
    }
    
    if (partner && partner.id === userId) {
      // Add friend to the list
      addFriendToList(userId, {
        username: partner.username,
        country: partner.country,
      });
      
      // Show success notification
      sonnerToast.success(`Friend request sent to ${partner.username}`);
      
      // Send a system message in the chat is handled by the usePartnerMessaging hook automatically
    }
  };

  return {
    sendMessage,
    startDirectChat,
    startVideoCall,
    addFriend
  };
}
