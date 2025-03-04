
import React, { useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import ChatContext from "./ChatContext";
import { useChatState } from "./useChatState";
import { useChatActions } from "./useChatActions";
import { useFriendRequests } from "./useFriendRequests";

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const state = useChatState(user);
  const actions = useChatActions(state, user);
  
  // Set up real-time friend request notifications
  useFriendRequests(user, state.refreshFriends);
  
  // Initialize chat when user is logged in and automatically find a partner
  useEffect(() => {
    if (user && !state.partner && !state.isFindingPartner) {
      actions.findNewPartner();
    }
  }, [user, state.partner, state.isFindingPartner]);
  
  // Combine state and actions to provide context value
  const contextValue = {
    ...state,
    ...actions
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
