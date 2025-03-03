
import React, { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useFriendManagement } from "@/hooks/useFriendManagement";
import { usePartnerManagement } from "@/hooks/usePartnerManagement";
import { Friend, Message, Partner, Location, GameAction } from "@/types/chat";

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
    mockFindPartner,
    sendMessage: sendPartnerMessage,
    sendGameAction,
    reportPartner,
    startDirectChat: initDirectChat,
    startVideoCall: initVideoCall
  } = usePartnerManagement();

  // Initialize chat when user is logged in
  useEffect(() => {
    if (user && !partner && !isFindingPartner) {
      mockFindPartner();
    }
  }, [user, partner, isFindingPartner]);
  
  // Wrapper functions to connect all our hooks together
  const findNewPartner = () => {
    mockFindPartner();
  };

  const sendMessage = (text: string) => {
    if (!user) return;
    sendPartnerMessage(text, user.id);
  };

  const startDirectChat = (userId: string) => {
    const friend = friends.find(f => f.id === userId);
    if (friend && !friend.blocked) {
      initDirectChat(friend.id, friend.username, friend.country);
    }
  };

  const startVideoCall = (userId: string) => {
    const friend = friends.find(f => f.id === userId);
    if (friend && !friend.blocked) {
      initVideoCall(friend.id, friend.username, friend.country);
    }
  };

  const addFriend = (userId: string) => {
    if (partner && partner.id === userId) {
      addFriendToList(userId, {
        username: partner.username,
        country: partner.country,
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
