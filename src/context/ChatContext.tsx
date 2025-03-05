
import React, { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useFriendManagement } from "@/hooks/useFriendManagement";
import { usePartnerManagement } from "@/hooks/usePartnerManagement";
import { Friend, Message, Partner, Location, GameAction } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { subscribeToFriendRequests, showFriendRequestNotification } from "@/services/friends/index";

interface ChatContextType {
  messages: Message[];
  partner: Partner | null;
  isConnecting: boolean;
  isConnected: boolean;
  isFindingPartner: boolean;
  isTyping: boolean;
  friends: Friend[];
  locationEnabled: boolean;
  userLocation: Location | null;
  sendMessage: (text: string) => void;
  sendGameAction: (action: GameAction) => void;
  setIsTyping: (typing: boolean) => void;
  findNewPartner: () => void;
  reportPartner: (reason: string) => void;
  toggleLocationTracking: () => void;
  refreshLocation: () => Promise<void>;
  blockUser: (userId: string) => void;
  unfriendUser: (userId: string) => void;
  startDirectChat: (userId: string) => void;
  startVideoCall: (userId: string) => void;
  addFriend: (userId: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  partner: null,
  isConnecting: false,
  isConnected: false,
  isFindingPartner: false,
  isTyping: false,
  friends: [],
  locationEnabled: false,
  userLocation: null,
  sendMessage: () => {},
  sendGameAction: () => {},
  setIsTyping: () => {},
  findNewPartner: () => {},
  reportPartner: () => {},
  toggleLocationTracking: () => {},
  refreshLocation: async () => {},
  blockUser: () => {},
  unfriendUser: () => {},
  startDirectChat: () => {},
  startVideoCall: () => {},
  addFriend: () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { 
    locationEnabled, 
    userLocation, 
    refreshLocation, 
    toggleLocationTracking 
  } = useLocationTracking();
  
  const {
    friends,
    blockUser,
    unfriendUser,
    addFriend: addFriendToList,
    refreshFriends
  } = useFriendManagement();
  
  const {
    partner,
    isConnecting,
    isConnected,
    isFindingPartner,
    isTyping,
    messages,
    setIsTyping,
    findPartner,
    sendMessage: sendPartnerMessage,
    sendGameAction,
    reportPartner,
    startDirectChat: initDirectChat,
    startVideoCall: initVideoCall
  } = usePartnerManagement();

  // Initialize chat when user is logged in and automatically find a partner
  useEffect(() => {
    if (user && !partner && !isFindingPartner) {
      findPartner();
    }
  }, [user, partner, isFindingPartner]);
  
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
  
  // Wrapper functions to connect all our hooks together
  const findNewPartner = () => {
    findPartner();
  };

  const sendMessage = (text: string) => {
    if (!user) return;
    sendPartnerMessage(text, user.id);
  };

  const startDirectChat = (userId: string) => {
    const friend = friends.find(f => f.id === userId);
    if (friend && !friend.blocked && !friend.pending) {
      initDirectChat(friend.id, friend.username, friend.country);
    } else if (friend && friend.pending) {
      sonnerToast.error("Cannot chat with pending friend. Wait for them to accept your request.");
    } else {
      toast({
        variant: "destructive",
        description: "Could not start chat with this user."
      });
    }
  };

  const startVideoCall = (userId: string) => {
    const friend = friends.find(f => f.id === userId);
    if (friend && !friend.blocked && !friend.pending && friend.status === 'online') {
      initVideoCall(friend.id, friend.username, friend.country);
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
      
      // Send a system message in the chat
      const systemMessage = {
        id: Math.random().toString(),
        sender: "system",
        text: `You sent a friend request to ${partner.username}.`,
        timestamp: Date.now(),
        isOwn: false,
      };
      
      // Add the system message to the chat
      // Handled by the usePartnerMessaging hook automatically
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        partner,
        isConnecting,
        isConnected,
        isFindingPartner,
        isTyping,
        friends,
        locationEnabled,
        userLocation,
        sendMessage,
        sendGameAction,
        setIsTyping,
        findNewPartner,
        reportPartner,
        toggleLocationTracking,
        refreshLocation,
        blockUser,
        unfriendUser,
        startDirectChat,
        startVideoCall,
        addFriend,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
