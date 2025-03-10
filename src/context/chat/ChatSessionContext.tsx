
import React, { createContext, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthContext from "@/context/AuthContext";
import { nanoid } from "nanoid";

interface ChatSessionContextType {
  setupUserActivity: () => Promise<void>;
  cleanupUserActivity: () => Promise<void>;
}

const ChatSessionContext = createContext<ChatSessionContextType>({
  setupUserActivity: async () => {},
  cleanupUserActivity: async () => {}
});

export const ChatSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Track active status for real-time connections
  useEffect(() => {
    if (!user) return;
    
    // Initial setup
    setupUserActivity();
    
    // Update user's active status every 30 seconds
    const interval = setInterval(setupUserActivity, 30000);
    
    // Clean up on unmount
    return () => {
      clearInterval(interval);
      cleanupUserActivity();
    };
  }, [user]);

  const setupUserActivity = async () => {
    if (!user) return;
    
    try {
      await supabase.from('active_users').upsert({
        user_id: user.id,
        status: 'online',
        last_seen: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating activity status:', error);
    }
  };

  const cleanupUserActivity = async () => {
    if (!user) return;
    
    try {
      await supabase.from('active_users').upsert({
        user_id: user.id,
        status: 'offline',
        last_seen: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating offline status:', error);
    }
  };

  // Setup user availability for random matching
  useEffect(() => {
    if (!user) return;
    
    const setupUserAvailability = async () => {
      try {
        // Generate a peer ID for this user
        const peerId = `user_${user.id}_${nanoid(6)}`;
        
        // Make the user available for matching
        await supabase.from('waiting_users').upsert({
          user_id: user.id,
          peer_id: peerId,
          is_available: true
        });
        
        // Set up listener for matches
        const channel = supabase
          .channel('public:waiting_users')
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'waiting_users',
            filter: `user_id=eq.${user.id}`,
          }, (payload) => {
            console.log('Waiting user updated:', payload);
            
            if (payload.new && payload.new.match_status === 'matched' && payload.new.matched_user_id) {
              // We got matched with someone
              console.log('Matched with user:', payload.new.matched_user_id);
            }
          })
          .subscribe();
        
        return () => {
          supabase.removeChannel(channel);
          
          // Remove user from waiting list
          if (user) {
            supabase.from('waiting_users').delete().eq('user_id', user.id);
          }
        };
      } catch (error) {
        console.error('Error setting up user availability:', error);
      }
    };
    
    setupUserAvailability();
  }, [user]);

  return (
    <ChatSessionContext.Provider value={{ setupUserActivity, cleanupUserActivity }}>
      {children}
    </ChatSessionContext.Provider>
  );
};

export const useChatSession = () => useContext(ChatSessionContext);

export default ChatSessionContext;
