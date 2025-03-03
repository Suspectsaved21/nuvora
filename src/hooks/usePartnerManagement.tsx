
import { useState, useEffect } from "react";
import { Partner, Message } from "@/types/chat";
import { nanoid } from "nanoid";

export function usePartnerManagement() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isFindingPartner, setIsFindingPartner] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const mockFindPartner = () => {
    setIsFindingPartner(true);
    setIsConnected(false);
    setPartner(null);
    setMessages([]);
    
    setTimeout(() => {
      const mockPartner = {
        id: nanoid(),
        username: `User_${Math.floor(Math.random() * 10000)}`,
        country: ["USA", "Canada", "UK", "Australia", "Germany", "Japan"][
          Math.floor(Math.random() * 6)
        ],
        language: ["English", "Spanish", "French", "German", "Japanese"][
          Math.floor(Math.random() * 5)
        ],
      };
      
      setPartner(mockPartner);
      setIsConnected(true);
      setIsFindingPartner(false);
      
      setMessages([
        {
          id: nanoid(),
          sender: "system",
          text: `You are now connected with ${mockPartner.username}`,
          timestamp: Date.now(),
          isOwn: false,
        },
      ]);
    }, 2000);
  };

  const sendMessage = (text: string, userId: string) => {
    if (!partner) return;
    
    const newMessage = {
      id: nanoid(),
      sender: userId,
      text: text,
      timestamp: Date.now(),
      isOwn: true,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    setTimeout(() => {
      const responses = [
        "That's interesting!",
        "I see your point.",
        "I've never thought of it that way.",
        "I agree with you.",
        "How about we change the subject?",
        "Where are you from?",
        "What do you do for fun?",
        "What's the weather like there?",
      ];
      
      const partnerResponse = {
        id: nanoid(),
        sender: partner.id,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        isOwn: false,
      };
      
      setMessages((prev) => [...prev, partnerResponse]);
    }, 1000 + Math.random() * 2000);
  };

  const sendGameAction = (gameAction: any) => {
    const { action, gameType, liked } = gameAction;
    
    if (!partner) return;
    
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

  const reportPartner = (reason: string) => {
    if (!partner) return;
    console.log(`Reported ${partner.username} for: ${reason}`);
    mockFindPartner();
  };

  const startDirectChat = (userId: string, username: string, country?: string) => {
    setPartner({
      id: userId,
      username: username,
      country: country,
    });
    setIsConnected(true);
    setIsFindingPartner(false);
    
    setMessages([
      {
        id: nanoid(),
        sender: "system",
        text: `You are now connected with ${username}`,
        timestamp: Date.now(),
        isOwn: false,
      },
    ]);
  };

  const startVideoCall = (userId: string, username: string, country?: string) => {
    setPartner({
      id: userId,
      username: username,
      country: country,
    });
    setIsConnected(true);
    setIsFindingPartner(false);
    
    setMessages([
      {
        id: nanoid(),
        sender: "system",
        text: `Video call initiated with ${username}`,
        timestamp: Date.now(),
        isOwn: false,
      },
    ]);
  };

  return {
    partner,
    isConnecting,
    isConnected,
    isFindingPartner,
    isTyping,
    messages,
    setIsTyping,
    mockFindPartner,
    sendMessage,
    sendGameAction,
    reportPartner,
    startDirectChat,
    startVideoCall,
    setMessages
  };
}
