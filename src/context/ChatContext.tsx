
import React, { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { useLocationTracking, MatchingPreference } from "@/hooks/useLocationTracking";
import { useFriendManagement } from "@/hooks/useFriendManagement";
import { usePartnerManagement } from "@/hooks/usePartnerManagement";
import { Friend, Message, Partner, Location, GameAction } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";

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
  matchingPreference: MatchingPreference;
  setMatchingPreference: (preference: MatchingPreference) => void;
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
  matchingPreference: "regional",
  setMatchingPreference: () => {},
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
    toggleLocationTracking,
    matchingPreference,
    setMatchingPreference
  } = useLocationTracking();
  
  const {
    friends,
    blockUser,
    unfriendUser,
    addFriend: addFriendToList
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

  // Initialize chat when user is logged in
  useEffect(() => {
    if (user && !partner && !isFindingPartner) {
      findPartner();
    }
  }, [user, partner, isFindingPartner]);
  
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
    if (friend && !friend.blocked) {
      initDirectChat(friend.id, friend.username, friend.country);
    } else {
      toast({
        variant: "destructive",
        description: "Could not start chat with this user."
      });
    }
  };

  const startVideoCall = (userId: string) => {
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

  const addFriend = (userId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "You need to be logged in to add friends."
      });
      return;
    }
    
    if (partner && partner.id === userId) {
      addFriendToList(userId, {
        username: partner.username,
        country: partner.country,
      });
      
      toast({
        description: `${partner.username} added to your friends list.`
      });
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
        matchingPreference,
        setMatchingPreference,
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
