
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { usePartnerSearch } from "./usePartnerSearch";
import { usePartnerMessaging } from "./usePartnerMessaging";

export function usePartnerManagement() {
  const {
    partner,
    isConnecting,
    isConnected,
    isFindingPartner,
    findPartner: searchPartner,
    mockFindPartner,
    startDirectChat: initDirectChat,
    startVideoCall: initVideoCall,
    setPartner,
    setIsConnected,
    setIsFindingPartner
  } = usePartnerSearch();
  
  const {
    messages,
    isTyping,
    setIsTyping,
    sendMessage,
    sendGameAction,
    setMessages
  } = usePartnerMessaging(partner);

  /**
   * Find a new partner and set up the chat
   */
  const findPartner = async () => {
    setMessages([]);
    const result = await searchPartner();
    if (result) {
      setMessages([result.systemMessage]);
    }
  };

  /**
   * Report the current partner and find a new one
   */
  const reportPartner = async (reason: string) => {
    if (!partner) return;
    
    if (partner.id && partner.id.length > 10) {
      try {
        toast({
          description: `Report submitted. Finding you a new partner.`,
        });
      } catch (error) {
        console.error("Error reporting partner:", error);
      }
    }
    
    findPartner();
  };

  /**
   * Start a direct chat with a specific user
   */
  const startDirectChat = async (userId: string, username: string, country?: string) => {
    setMessages([]);
    const result = await initDirectChat(userId, username, country);
    if (result) {
      setMessages([result.systemMessage]);
    }
  };

  /**
   * Start a video call with a specific user
   */
  const startVideoCall = async (userId: string, username: string, country?: string) => {
    setMessages([]);
    const result = await initVideoCall(userId, username, country);
    if (result) {
      setMessages([result.systemMessage]);
    }
  };

  return {
    partner,
    isConnecting,
    isConnected,
    isFindingPartner,
    isTyping,
    messages,
    setIsTyping,
    mockFindPartner,
    findPartner,
    sendMessage,
    sendGameAction,
    reportPartner,
    startDirectChat,
    startVideoCall,
    setMessages
  };
}
