
import { useState } from "react";
import { nanoid } from "nanoid";
import { Partner, Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

export function useDirectConnections() {
  const { user } = useContext(AuthContext);

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
    startDirectChat,
    startVideoCall
  };
}
