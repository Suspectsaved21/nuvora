
import React, { createContext, useState, useContext } from "react";
import AuthContext from "./AuthContext";
import { ChatContextType } from "./chat/ChatContextTypes";
import { ChatSessionProvider } from "./chat/ChatSessionContext";
import { ChatVideoProvider, useChatVideo } from "./chat/ChatVideoContext";
import { ChatFriendsProvider, useChatFriends } from "./chat/ChatFriendsContext";
import { ChatLocationProvider, useChatLocation } from "./chat/ChatLocationContext";
import { ChatPartnerProvider, useChatPartner } from "./chat/ChatPartnerContext";
import { toast } from "@/components/ui/use-toast";

// Create the context with default values
const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ChatSessionProvider>
      <ChatVideoProvider>
        <ChatFriendsProvider>
          <ChatLocationProvider>
            <ChatPartnerProvider>
              <ChatContextConnector>
                {children}
              </ChatContextConnector>
            </ChatPartnerProvider>
          </ChatLocationProvider>
        </ChatFriendsProvider>
      </ChatVideoProvider>
    </ChatSessionProvider>
  );
};

// This component connects all the context pieces together into a unified API
const ChatContextConnector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { videoSession, initializeVideoCall } = useChatVideo();
  const { friends, blockUser, unfriendUser, addFriend: addFriendToList } = useChatFriends();
  const { locationEnabled, userLocation, toggleLocationTracking, refreshLocation } = useChatLocation();
  const { 
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
    cancelFindPartner,
    reportPartner,
    startDirectChat,
    startVideoCall: initVideoCall
  } = useChatPartner();

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
      toast({
        description: `Friend request sent to ${partner.username}.`
      });
      
      // Send a system message in the chat
      sendMessage(`I'd like to add you as a friend!`);
    }
  };

  // Wrapper for the video call that uses both contexts
  const startVideoCall = (userId: string) => {
    const friend = friends.find(f => f.id === userId);
    if (friend && !friend.blocked) {
      initializeVideoCall(userId);
      initVideoCall(userId);
    } else {
      toast({
        variant: "destructive",
        description: "Could not start video call with this user."
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
        videoSession,
        sendMessage,
        sendGameAction,
        setIsTyping,
        findNewPartner,
        cancelFindPartner,
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
