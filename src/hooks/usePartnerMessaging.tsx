
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Partner, Message, GameAction } from "@/types/chat";
import { generatePartnerResponse, saveMessageToDatabase, fetchMessagesFromDatabase } from "@/utils/partnerUtils";

export function usePartnerMessaging(partner: Partner | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  /**
   * Send a message to the current partner
   */
  const sendMessage = async (text: string, userId: string) => {
    if (!partner) return;
    
    const newMessage = {
      id: nanoid(),
      sender: userId,
      text: text,
      timestamp: Date.now(),
      isOwn: true,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    if (partner && partner.id && partner.id.length > 10) {
      await saveMessageToDatabase(userId, partner.id, text);
    }
    
    // Simulate partner response
    setTimeout(() => {
      const partnerResponse = generatePartnerResponse(partner.id);
      setMessages((prev) => [...prev, partnerResponse]);
    }, 1000 + Math.random() * 2000);
  };

  /**
   * Send a game-related action
   */
  const sendGameAction = (gameAction: GameAction) => {
    if (!partner) return;
    
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
    
    if (action === "start") {
      setTimeout(() => {
        const partnerResponse = {
          id: nanoid(),
          sender: partner.id,
          text: "I'm ready to play! Let's go!",
          timestamp: Date.now(),
          isOwn: false,
        };
        
        setMessages((prev) => [...prev, partnerResponse]);
      }, 1000);
    }
  };

  /**
   * Fetch messages from the database when partner changes
   */
  useEffect(() => {
    const loadMessages = async () => {
      if (!partner) return;
      
      const fetchedMessages = await fetchMessagesFromDatabase(partner.id);
      
      if (fetchedMessages) {
        setMessages(prev => {
          const systemMessages = prev.filter(msg => msg.sender === 'system');
          return [...systemMessages, ...fetchedMessages];
        });
      }
    };
    
    loadMessages();
  }, [partner]);

  return {
    messages,
    isTyping,
    setIsTyping,
    sendMessage,
    sendGameAction,
    setMessages
  };
}
