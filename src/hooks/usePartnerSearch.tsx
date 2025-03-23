
import { useState } from "react";
import { Partner, Message } from "@/types/chat";
import { usePartnerFinder } from "./partner/usePartnerFinder";
import { useDirectConnections } from "./partner/useDirectConnections";

export function usePartnerSearch() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const {
    isFindingPartner,
    setIsFindingPartner,
    findPartner: searchPartner,
    cancelSearch: cancelPartnerSearch,
    mockFindPartner
  } = usePartnerFinder();
  
  const {
    startDirectChat: initiateDirectChat,
    startVideoCall: initiateVideoCall
  } = useDirectConnections();

  /**
   * Find a partner and handle state updates
   */
  const findPartner = async () => {
    setIsConnected(false);
    setPartner(null);
    
    const result = await searchPartner();
    if (result) {
      setPartner(result.partner);
      setIsConnected(true);
    }
    
    return result;
  };

  /**
   * Cancel search and clean up state
   */
  const cancelSearch = async () => {
    await cancelPartnerSearch();
  };

  /**
   * Start a direct chat with specific user
   */
  const startDirectChat = async (userId: string, username: string, country?: string) => {
    setIsConnected(false);
    
    const result = await initiateDirectChat(userId, username, country);
    if (result) {
      setPartner(result.partner);
      setIsConnected(true);
    }
    
    return result;
  };

  /**
   * Start a video call with specific user
   */
  const startVideoCall = async (userId: string, username: string, country?: string) => {
    setIsConnected(false);
    
    const result = await initiateVideoCall(userId, username, country);
    if (result) {
      setPartner(result.partner);
      setIsConnected(true);
    }
    
    return result;
  };

  return {
    partner,
    isConnecting,
    isConnected,
    isFindingPartner,
    findPartner,
    cancelSearch,
    mockFindPartner,
    startDirectChat,
    startVideoCall,
    setPartner,
    setIsConnected,
    setIsFindingPartner
  };
}
