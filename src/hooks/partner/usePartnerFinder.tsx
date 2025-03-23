
import { useState } from "react";
import { nanoid } from "nanoid";
import { Partner, Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { createMockPartner, findRandomPartner } from "@/utils/partnerUtils";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export function usePartnerFinder() {
  const [isFindingPartner, setIsFindingPartner] = useState(false);
  const { user } = useContext(AuthContext);

  /**
   * Find a new random partner from the database or create a mock one
   */
  const findPartner = async () => {
    if (!user) return null;
    
    // Only proceed if not already finding a partner
    if (isFindingPartner) return null;
    
    setIsFindingPartner(true);
    
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
        // As a last resort, use a mock partner
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
  const cancelSearch = async () => {
    if (!user) return;
    
    setIsFindingPartner(false);
    
    // Remove user from waiting list if they're there
    try {
      await supabase
        .from('waiting_users')
        .delete()
        .eq('user_id', user.id);
      
      console.log("Removed from waiting list");
    } catch (error) {
      console.error("Error removing from waiting list:", error);
    }
  };

  /**
   * Create a mock partner when database search fails
   */
  const mockFindPartner = async () => {
    return new Promise<{ partner: Partner, systemMessage: Message }>((resolve) => {
      setTimeout(() => {
        const mockPartner = createMockPartner();
        
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

  return {
    isFindingPartner,
    setIsFindingPartner,
    findPartner,
    cancelSearch,
    mockFindPartner
  };
}
