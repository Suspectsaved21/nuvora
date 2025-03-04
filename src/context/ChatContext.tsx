
import React, { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useFriendManagement } from "@/hooks/useFriendManagement";
import { usePartnerManagement } from "@/hooks/usePartnerManagement";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useChatFunctions } from "@/hooks/useChatFunctions";
import { ChatContextType } from "@/types/chatContext";
import { Message, GameAction } from "@/types/chat";

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
  
  // Hooks for different functionalities
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

  // Set up friend request notifications
  useFriendRequests(user, refreshFriends);

  // Get common chat functions
  const {
    sendMessage: messageSender,
    startDirectChat: chatStarter,
    startVideoCall: callStarter,
    addFriend: friendAdder
  } = useChatFunctions(user, partner, friends, addFriendToList);

  // Initialize chat when user is logged in and automatically find a partner
  useEffect(() => {
    if (user && !partner && !isFindingPartner) {
      findPartner();
    }
  }, [user, partner, isFindingPartner]);
  
  // Wrapper functions
  const findNewPartner = () => {
    findPartner();
  };

  const sendMessage = (text: string) => {
    messageSender(text, sendPartnerMessage);
  };

  const startDirectChat = (userId: string) => {
    chatStarter(userId, initDirectChat);
  };

  const startVideoCall = (userId: string) => {
    callStarter(userId, initVideoCall);
  };

  const addFriend = (userId: string) => {
    friendAdder(userId);
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
