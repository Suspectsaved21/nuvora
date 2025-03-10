
import React, { createContext, useContext } from "react";
import { Location } from "@/types/chat";
import { useLocationTracking } from "@/hooks/useLocationTracking";

interface ChatLocationContextType {
  locationEnabled: boolean;
  userLocation: Location | null;
  toggleLocationTracking: () => void;
  refreshLocation: () => Promise<void>;
}

const ChatLocationContext = createContext<ChatLocationContextType>({
  locationEnabled: false,
  userLocation: null,
  toggleLocationTracking: () => {},
  refreshLocation: async () => {}
});

export const ChatLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    locationEnabled, 
    userLocation, 
    refreshLocation, 
    toggleLocationTracking 
  } = useLocationTracking();

  return (
    <ChatLocationContext.Provider value={{
      locationEnabled,
      userLocation,
      toggleLocationTracking,
      refreshLocation
    }}>
      {children}
    </ChatLocationContext.Provider>
  );
};

export const useChatLocation = () => useContext(ChatLocationContext);

export default ChatLocationContext;
