
import { useState } from "react";
import { Partner, Message } from "@/types/chat";
import { nanoid } from "nanoid";
import { findRandomPartner, createMockPartner } from "@/utils/partnerUtils";

export function usePartnerSearch() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isFindingPartner, setIsFindingPartner] = useState(false);
  
  /**
   * Find a new random partner from the database or create a mock one
   */
  const findPartner = async () => {
    setIsFindingPartner(true);
    setIsConnected(false);
    setPartner(null);
    
    try {
      const foundPartner = await findRandomPartner();
      
      if (foundPartner) {
        setPartner(foundPartner);
        setIsConnected(true);
        
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
        return await mockFindPartner();
      }
    } catch (error) {
      console.error("Error finding partner:", error);
      return await mockFindPartner();
    } finally {
      setIsFindingPartner(false);
    }
  };

  /**
   * Create a mock partner when database search fails
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
    if (userId && userId.length > 10) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          username = data.username;
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
    return startDirectChat(userId, username, country).then(result => {
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
    mockFindPartner,
    startDirectChat,
    startVideoCall,
    setPartner,
    setIsConnected,
    setIsFindingPartner
  };
}

// Need to add this import at the top since it's used in startDirectChat
import { supabase } from "@/integrations/supabase/client";
