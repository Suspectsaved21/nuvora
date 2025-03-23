
import { useState } from "react";
import { Partner, Message } from "@/types/chat";
import { nanoid } from "nanoid";
import { findRandomPartner, createMockPartner } from "@/utils/partnerUtils";
import { supabase } from "@/integrations/supabase/client";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export function usePartnerSearch() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isFindingPartner, setIsFindingPartner] = useState(false);
  const { user } = useContext(AuthContext);
  
  /**
   * Find a new random partner from the database or create a mock one
   * This now only searches once per call, not automatically
   */
  const findPartner = async () => {
    if (!user) return null;
    
    // Only proceed if not already finding a partner
    if (isFindingPartner) return null;
    
    setIsFindingPartner(true);
    setIsConnected(false);
    setPartner(null);
    
    try {
      // Generate a peer ID for this user
      const peerId = `user_${user.id}_${nanoid(6)}`;
      
      // First, check if there are other users waiting for a match
      const { data: waitingUsers } = await supabase
        .from('waiting_users')
        .select('user_id, peer_id')
        .not('user_id', 'eq', user.id)
        .eq('is_available', true)
        .limit(10);
      
      if (waitingUsers && waitingUsers.length > 0) {
        // Choose a random user from the waiting list
        const randomIndex = Math.floor(Math.random() * waitingUsers.length);
        const matchedUserId = waitingUsers[randomIndex].user_id;
        const matchedPeerId = waitingUsers[randomIndex].peer_id;
        
        // Update our waiting status
        await supabase.from('waiting_users').upsert({
          user_id: user.id,
          peer_id: peerId,
          is_available: false
        });
        
        // Update the matched user's status
        await supabase.from('waiting_users').upsert({
          user_id: matchedUserId,
          peer_id: matchedPeerId,
          is_available: false
        });
        
        // Get the matched user's information
        const { data: userData } = await supabase
          .from('profiles')
          .select('username, country')
          .eq('id', matchedUserId)
          .single();
        
        // Create partner object
        const matchedPartner: Partner = {
          id: matchedUserId,
          username: userData?.username || 'Anonymous',
          country: userData?.country || undefined,
        };
        
        // Update state
        setPartner(matchedPartner);
        setIsConnected(true);
        setIsFindingPartner(false);
        
        return {
          partner: matchedPartner,
          systemMessage: {
            id: nanoid(),
            sender: "system",
            text: `You are now connected with ${matchedPartner.username}`,
            timestamp: Date.now(),
            isOwn: false,
          }
        };
      }
      
      // If no waiting users, make us available
      await supabase.from('waiting_users').upsert({
        user_id: user.id,
        peer_id: peerId,
        is_available: true
      });
      
      // Try to find a partner from active users (fallback)
      const foundPartner = await findRandomPartner();
      
      if (foundPartner) {
        setPartner(foundPartner);
        setIsConnected(true);
        setIsFindingPartner(false);
        
        return {
          partner: foundPartner,
          systemMessage: {
            id: nanoid(),
            sender: "system",
            text: `You are now connected with ${foundPartner.username}`,
            timestamp: Date.now(),
            isOwn: false,
          }
        };
      } else {
        // As a last resort, use a mock partner while we wait for a real match
        return await mockFindPartner();
      }
    } catch (error) {
      console.error("Error finding partner:", error);
      return await mockFindPartner();
    }
  };

  /**
   * Cancel the search for a new partner
   */
  const cancelSearch = () => {
    if (!user) return;
    
    setIsFindingPartner(false);
    
    // Remove user from waiting list if they're there
    try {
      supabase.from('waiting_users')
        .delete()
        .eq('user_id', user.id)
        .then(() => {
          console.log("Removed from waiting list");
        });
    } catch (error) {
      console.error("Error removing from waiting list:", error);
    }
  };

  /**
   * Create a mock partner when database search fails
   * Now only runs once rather than automatically continuing
   */
  const mockFindPartner = () => {
    setIsFindingPartner(true);
    setIsConnected(false);
    setPartner(null);
    
    return new Promise<{ partner: Partner, systemMessage: Message }>((resolve) => {
      setTimeout(() => {
        const mockPartner = createMockPartner();
        
        setPartner(mockPartner);
        setIsConnected(true);
        setIsFindingPartner(false);
        
        resolve({
          partner: mockPartner,
          systemMessage: {
            id: nanoid(),
            sender: "system",
            text: `You are now connected with ${mockPartner.username}`,
            timestamp: Date.now(),
            isOwn: false,
          }
        });
      }, 2000);
    });
  };

  /**
   * Start a direct chat with a specific user
   */
  const startDirectChat = async (userId: string, username: string, country?: string) => {
    if (!user) return null;
    
    if (userId && userId.length > 10) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, country')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          username = data.username || username;
          country = data.country || country;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    
    const directPartner = {
      id: userId,
      username: username,
      country: country,
    };
    
    setPartner(directPartner);
    setIsConnected(true);
    setIsFindingPartner(false);
    
    // Add a chat record to track the conversation
    try {
      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: userId,
        content: `Chat started by ${user.username}`,
        is_read: false
      });
    } catch (error) {
      console.error("Error creating chat record:", error);
    }
    
    return {
      partner: directPartner,
      systemMessage: {
        id: nanoid(),
        sender: "system",
        text: `You are now connected with ${username}`,
        timestamp: Date.now(),
        isOwn: false,
      }
    };
  };

  /**
   * Start a video call with a specific user
   */
  const startVideoCall = (userId: string, username: string, country?: string) => {
    if (!user) return null;
    
    // First establish a direct chat connection
    return startDirectChat(userId, username, country).then(result => {
      if (!result) return null;
      
      // Then update with video call specific message
      return {
        ...result,
        systemMessage: {
          id: nanoid(),
          sender: "system",
          text: `Video call initiated with ${username}`,
          timestamp: Date.now(),
          isOwn: false,
        }
      };
    });
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
