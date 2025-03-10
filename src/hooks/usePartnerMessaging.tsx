import { useState, useEffect, useContext } from "react";
import { nanoid } from "nanoid";
import { Partner, Message, GameAction } from "@/types/chat";
import { generatePartnerResponse, saveMessageToDatabase, fetchMessagesFromDatabase } from "@/utils/partnerUtils";
import AuthContext from "@/context/AuthContext";

export function usePartnerMessaging(partner: Partner | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useContext(AuthContext);

  /**
   * Send a message to the current partner
   */
  const sendMessage = async (text: string, userId: string, messageType: 'user' | 'system' = 'user') => {
    if (!partner || !user) return;
    
    const newMessage = {
      id: nanoid(),
      sender: userId,
      text: text,
      timestamp: Date.now(),
      isOwn: true,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    if (partner && partner.id && partner.id.length > 10) {
      // Save to database if partner has a valid ID (not a mock partner)
      await saveMessageToDatabase(userId, partner.id, text, messageType);
      
      // For real partners, they will reply via the real-time channel
      // But for mock partners, we simulate responses
      if (partner.id.length < 20) { // Simple way to detect mock partners
        simulatePartnerTyping();
        
        setTimeout(() => {
          const partnerResponse = generatePartnerResponse(partner.id);
          setMessages((prev) => [...prev, partnerResponse]);
        }, 1500 + Math.random() * 2000);
      }
    } else {
      // Always simulate responses for mock partners
      simulatePartnerTyping();
      
      setTimeout(() => {
        const partnerResponse = generatePartnerResponse(partner.id);
        setMessages((prev) => [...prev, partnerResponse]);
      }, 1000 + Math.random() * 2000);
    }
  };
  
  /**
   * Simulate the partner typing
   */
  const simulatePartnerTyping = () => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  /**
   * Send a game-related action
   */
  const sendGameAction = (gameAction: GameAction) => {
    if (!partner || !user) return;
    
    const { action, gameType, liked } = gameAction;
    
    console.log(`Sending game action: ${action} for ${gameType}`);
    
    let systemMessage = "";
    
    switch (action) {
      case "start":
        systemMessage = `Started a game of ${gameType}`;
        break;
      case "next":
        systemMessage = "Moving to next item...";
        break;
      case "reveal":
        systemMessage = "Answer revealed!";
        break;
      case "rate":
        systemMessage = liked 
          ? "👍 You liked this item! +5 points" 
          : "👎 Moving to next item...";
        break;
      case "answer":
        systemMessage = "Submitted an answer";
        break;
      default:
        systemMessage = "Game event occurred";
    }
    
    const newMessage = {
      id: nanoid(),
      sender: "system",
      text: systemMessage,
      timestamp: Date.now(),
      isOwn: false,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // If it's a real partner, save the game action as a system message
    if (partner.id.length > 10) {
      saveMessageToDatabase(
        user.id, 
        partner.id, 
        `[GAME] ${systemMessage}`, 
        'system'
      );
    }
    
    if (action === "start") {
      simulatePartnerTyping();
      
      setTimeout(() => {
        const partnerResponse = {
          id: nanoid(),
          sender: partner.id,
          text: "I'm ready to play! Let's go!",
          timestamp: Date.now(),
          isOwn: false,
        };
        
        setMessages((prev) => [...prev, partnerResponse]);
        
        // Save partner's response for real partners
        if (partner.id.length > 10) {
          saveMessageToDatabase(partner.id, user.id, partnerResponse.text);
        }
      }, 1000);
    }
  };

  /**
   * Fetch messages from the database when partner changes
   */
  useEffect(() => {
    const loadMessages = async () => {
      if (!partner || !user) return;
      
      // Only fetch real messages if partner is real (valid ID)
      if (partner.id.length > 10) {
        const fetchedMessages = await fetchMessagesFromDatabase(user.id, partner.id);
        
        if (fetchedMessages) {
          setMessages(prev => {
            const systemMessages = prev.filter(msg => msg.sender === 'system');
            return [...systemMessages, ...fetchedMessages];
          });
        }
      } else {
        // For mock partners, just keep system messages
        setMessages(prev => prev.filter(msg => msg.sender === 'system'));
      }
    };
    
    loadMessages();
    
    // Listen for real-time messages from this partner
    if (partner && partner.id.length > 10 && user) {
      const channel = supabase
        .channel(`messages:${partner.id}:${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        }, (payload) => {
          // Check if the message is from the current partner
          if (payload.new && payload.new.sender_id === partner.id) {
            const newMessage: Message = {
              id: payload.new.id.toString(),
              sender: payload.new.sender_id,
              text: payload.new.content,
              timestamp: new Date(payload.new.created_at).getTime(),
              isOwn: false,
            };
            
            setMessages(prev => [...prev, newMessage]);
          }
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [partner, user]);

  return {
    messages,
    isTyping,
    setIsTyping,
    sendMessage,
    sendGameAction,
    setMessages
  };
}

// Import supabase at the top of the file
import { supabase } from "@/integrations/supabase/client";
