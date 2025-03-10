
import React, { createContext, useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { usePartnerManagement } from "@/hooks/usePartnerManagement";
import { Partner, Message, GameAction } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { nanoid } from "nanoid";

interface ChatPartnerContextType {
  partner: Partner | null;
  isConnecting: boolean;
  isConnected: boolean;
  isFindingPartner: boolean;
  isTyping: boolean;
  messages: Message[];
  sendMessage: (text: string) => void;
  sendGameAction: (action: GameAction) => void;
  setIsTyping: (typing: boolean) => void;
  findNewPartner: () => void;
  reportPartner: (reason: string) => void;
  startDirectChat: (userId: string) => void;
  startVideoCall: (userId: string) => void;
}

const ChatPartnerContext = createContext<ChatPartnerContextType>({
  partner: null,
  isConnecting: false,
  isConnected: false,
  isFindingPartner: false,
  isTyping: false,
  messages: [],
  sendMessage: () => {},
  sendGameAction: () => {},
  setIsTyping: () => {},
  findNewPartner: () => {},
  reportPartner: () => {},
  startDirectChat: () => {},
  startVideoCall: () => {}
});

export const ChatPartnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  
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
  }, [user, partner, isFindingPartner, findPartner]);

  // Wrapper functions to connect all our hooks together
  const findNewPartner = () => {
    findPartner();
  };

  const sendMessage = (text: string) => {
    if (!user) return;
    sendPartnerMessage(text, user.id);
  };

  const startDirectChat = (userId: string) => {
    if (!user) return;
    
    // Get user details from friends list or database 
    // Note: This should come from friends context in a full implementation
    initDirectChat(userId, "Friend", "Unknown");
  };

  const startVideoCall = (userId: string) => {
    if (!user) return;
    
    // Get user details from friends list or database
    // Note: This should come from friends context in a full implementation
    initVideoCall(userId, "Friend", "Unknown");
  };

  return (
    <ChatPartnerContext.Provider
      value={{
        partner,
        isConnecting,
        isConnected,
        isFindingPartner,
        isTyping,
        messages,
        sendMessage,
        sendGameAction,
        setIsTyping,
        findNewPartner,
        reportPartner,
        startDirectChat,
        startVideoCall,
      }}
    >
      {children}
    </ChatPartnerContext.Provider>
  );
};

export const useChatPartner = () => useContext(ChatPartnerContext);

export default ChatPartnerContext;
