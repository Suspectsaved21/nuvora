
import { useState, useCallback } from "react";
import { Friend, Partner, Message, Location } from "@/types/chat";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useFriendManagement } from "@/hooks/useFriendManagement";
import { usePartnerManagement } from "@/hooks/usePartnerManagement";
import { User } from "@/types/auth";

export function useChatState(user: User | null) {
  // Location tracking
  const { 
    locationEnabled, 
    userLocation, 
    refreshLocation, 
    toggleLocationTracking 
  } = useLocationTracking();
  
  // Friend management
  const {
    friends,
    refreshFriends,
    blockUser,
    unfriendUser,
    addFriend: addFriendToList,
  } = useFriendManagement();
  
  // Partner management
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
  
  return {
    // Location state
    locationEnabled,
    userLocation,
    refreshLocation,
    toggleLocationTracking,
    
    // Friends state
    friends,
    refreshFriends,
    blockUser,
    unfriendUser,
    
    // Partner state
    partner,
    isConnecting,
    isConnected,
    isFindingPartner,
    isTyping,
    messages,
    setIsTyping,
    findPartner,
    sendPartnerMessage,
    sendGameAction,
    reportPartner,
    initDirectChat,
    initVideoCall,
    addFriendToList
  };
}
