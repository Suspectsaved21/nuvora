
import React, { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { nanoid } from "nanoid";

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isOwn: boolean;
}

interface Partner {
  id: string;
  username: string;
  country?: string;
  language?: string;
}

interface ChatContextType {
  messages: Message[];
  partner: Partner | null;
  isConnecting: boolean;
  isConnected: boolean;
  isFindingPartner: boolean;
  isTyping: boolean;
  sendMessage: (text: string) => void;
  setIsTyping: (typing: boolean) => void;
  findNewPartner: () => void;
  reportPartner: (reason: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  partner: null,
  isConnecting: false,
  isConnected: false,
  isFindingPartner: false,
  isTyping: false,
  sendMessage: () => {},
  setIsTyping: () => {},
  findNewPartner: () => {},
  reportPartner: () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isFindingPartner, setIsFindingPartner] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Mock finding a partner for demo
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
      
      // Add a system message
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

  // Initialize connection when user exists
  useEffect(() => {
    if (user && !partner && !isFindingPartner) {
      mockFindPartner();
    }
  }, [user, partner, isFindingPartner]);

  const sendMessage = (text: string) => {
    if (!user || !partner) return;
    
    // Filter inappropriate content (placeholder)
    const filteredText = text; // This would be replaced with actual filtering logic
    
    const newMessage = {
      id: nanoid(),
      sender: user.id,
      text: filteredText,
      timestamp: Date.now(),
      isOwn: true,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // Mock response after a delay
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

  const findNewPartner = () => {
    setPartner(null);
    mockFindPartner();
  };

  const reportPartner = (reason: string) => {
    if (!partner) return;
    console.log(`Reported ${partner.username} for: ${reason}`);
    findNewPartner();
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
        sendMessage,
        setIsTyping,
        findNewPartner,
        reportPartner,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
