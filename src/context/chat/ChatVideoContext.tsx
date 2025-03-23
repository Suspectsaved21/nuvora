
import React, { createContext, useState, useContext, useEffect } from "react";
import { VideoSession } from "@/types/chat";
import { nanoid } from "nanoid";
import AuthContext from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ChatVideoContextType {
  videoSession: VideoSession | null;
  initializeVideoCall: (userId: string, username: string, country?: string) => void;
  cleanupVideoSession: () => void;
}

const ChatVideoContext = createContext<ChatVideoContextType>({
  videoSession: null,
  initializeVideoCall: () => {},
  cleanupVideoSession: () => {}
});

export const ChatVideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videoSession, setVideoSession] = useState<VideoSession | null>(null);
  const { user } = useContext(AuthContext);

  const initializeVideoCall = async (partnerId: string, username: string, country?: string) => {
    if (!user) return;
    
    try {
      // Create a new video session ID
      const sessionId = nanoid();
      
      // Set the video session
      setVideoSession({
        sessionId,
        peerId: `user_${user.id}_${nanoid(6)}`,
        partnerId,
        isActive: true,
        startTime: Date.now()
      });
      
      // Fetch partner's peer ID if needed
      const { data } = await supabase
        .from('active_users')
        .select('peer_id')
        .eq('user_id', partnerId)
        .single();
      
      if (!data?.peer_id) {
        toast({
          variant: "destructive",
          description: "User is not available for video chat."
        });
      }
    } catch (error) {
      console.error('Error initializing video call:', error);
      toast({
        variant: "destructive",
        description: "Failed to initialize video call."
      });
    }
  };

  const cleanupVideoSession = () => {
    setVideoSession(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupVideoSession();
    };
  }, []);

  return (
    <ChatVideoContext.Provider value={{ videoSession, initializeVideoCall, cleanupVideoSession }}>
      {children}
    </ChatVideoContext.Provider>
  );
};

export const useChatVideo = () => useContext(ChatVideoContext);

export default ChatVideoContext;
