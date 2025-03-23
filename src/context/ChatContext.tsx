
import React, { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useFriendManagement } from "@/hooks/useFriendManagement";
import { usePartnerManagement } from "@/hooks/usePartnerManagement";
import { Friend, Message, Partner, Location, GameAction, VideoSession } from "@/types/chat";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";

interface ChatContextType {
  messages: Message[];
  partner: Partner | null;
  isConnecting: boolean;
  isConnected: boolean;
  isFindingPartner: boolean;
  isTyping: boolean;
  friends: Friend[];
  locationEnabled: boolean;
  userLocation: Location | null;
  videoSession: VideoSession | null;
  sendMessage: (text: string) => void;
  sendGameAction: (action: GameAction) => void;
  setIsTyping: (typing: boolean) => void;
  findNewPartner: () => void;
  reportPartner: (reason: string) => void;
  toggleLocationTracking: () => void;
  refreshLocation: () => Promise<void>;
  blockUser: (userId: string) => void;
  unfriendUser: (userId: string) => void;
  startDirectChat: (userId: string) => void;
  startVideoCall: (userId: string) => void;
  addFriend: (userId: string) => void;
}

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
  videoSession: null,
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
  const [videoSession, setVideoSession] = useState<VideoSession | null>(null);
  
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
    addFriend: addFriendToList
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

  // Make user available for random matching
  useEffect(() => {
    if (!user) return;
    
    const setupUserAvailability = async () => {
      try {
        // Make the user available for matching
        await supabase.from('waiting_users').upsert({
          user_id: user.id,
          last_seen: new Date().toISOString(),
          match_status: 'waiting'
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
              const partnerId = payload.new.matched_user_id;
              
              // Start video call with the matched user
              fetchUserAndStartCall(partnerId);
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
  
  // Helper function to fetch user info and start call
  const fetchUserAndStartCall = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('username, country')
        .eq('id', userId)
        .single();
      
      if (data) {
        initVideoCall(
          userId,
          data.username || 'Anonymous',
          data.country
        );
      } else {
        // If we can't get user details, still try to connect with minimal info
        initVideoCall(userId, 'Anonymous');
      }
    } catch (error) {
      console.error('Error fetching matched user:', error);
      initVideoCall(userId, 'Anonymous');
    }
  };

  // Initialize chat when user is logged in and automatically find a partner
  useEffect(() => {
    if (user && !partner && !isFindingPartner) {
      findPartner();
    }
  }, [user, partner, isFindingPartner]);
  
  // Track active status for real-time connections
  useEffect(() => {
    if (!user) return;
    
    // Update user's active status every 30 seconds
    const updateActivity = async () => {
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
    
    // Initial update
    updateActivity();
    
    // Set up interval for status updates
    const interval = setInterval(updateActivity, 30000);
    
    // Clean up on unmount
    return () => {
      clearInterval(interval);
      
      // Set user as offline when component unmounts
      if (user) {
        supabase.from('active_users').upsert({
          user_id: user.id,
          status: 'offline',
          last_seen: new Date().toISOString()
        });
      }
    };
  }, [user]);
  
  // Wrapper functions to connect all our hooks together
  const findNewPartner = () => {
    // Create a new video session ID
    const sessionId = nanoid();
    
    setVideoSession({
      sessionId,
      peerId: `user_${user?.id || 'guest'}_${nanoid(6)}`,
      partnerId: '',
      isActive: false,
      startTime: Date.now()
    });
    
    findPartner();
  };

  const sendMessage = (text: string) => {
    if (!user) return;
    sendPartnerMessage(text, user.id);
  };

  const startDirectChat = (userId: string) => {
    const friend = friends.find(f => f.id === userId);
    if (friend && !friend.blocked) {
      initDirectChat(friend.id, friend.username, friend.country);
    } else {
      toast({
        variant: "destructive",
        description: "Could not start chat with this user."
      });
    }
  };

  const startVideoCall = (userId: string) => {
    const friend = friends.find(f => f.id === userId);
    if (friend && !friend.blocked) {
      // Create a new video session
      const sessionId = nanoid();
      
      setVideoSession({
        sessionId,
        peerId: `user_${user?.id || 'guest'}_${nanoid(6)}`,
        partnerId: friend.id,
        isActive: true,
        startTime: Date.now()
      });
      
      initVideoCall(friend.id, friend.username, friend.country);
    } else {
      toast({
        variant: "destructive",
        description: "Could not start video call with this user."
      });
    }
  };

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
      const systemMessage = {
        id: nanoid(),
        sender: "system",
        text: `You sent a friend request to ${partner.username}.`,
        timestamp: Date.now(),
        isOwn: false,
      };
      
      // Add the system message to the chat
      // Using sendPartnerMessage to handle storing in DB if needed
      sendPartnerMessage(`I'd like to add you as a friend!`, user.id, 'system');
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
