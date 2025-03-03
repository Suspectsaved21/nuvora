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

export interface Friend {
  id: string;
  username: string;
  country?: string;
  language?: string;
  status: "online" | "offline";
  lastSeen?: number;
  blocked?: boolean;
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
  friends: Friend[];
  locationEnabled: boolean;
  sendMessage: (text: string) => void;
  setIsTyping: (typing: boolean) => void;
  findNewPartner: () => void;
  reportPartner: (reason: string) => void;
  toggleLocationTracking: () => void;
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
  sendMessage: () => {},
  setIsTyping: () => {},
  findNewPartner: () => {},
  reportPartner: () => {},
  toggleLocationTracking: () => {},
  blockUser: () => {},
  unfriendUser: () => {},
  startDirectChat: () => {},
  startVideoCall: () => {},
  addFriend: () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isFindingPartner, setIsFindingPartner] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: nanoid(),
      username: "Emma_Wilson",
      country: "Canada",
      status: "online",
      lastSeen: Date.now(),
    },
    {
      id: nanoid(),
      username: "Alex_Thompson",
      country: "UK",
      status: "offline",
      lastSeen: Date.now() - 60000 * 30,
    },
    {
      id: nanoid(),
      username: "Sophia_Martin",
      country: "Australia",
      status: "online",
      lastSeen: Date.now(),
    },
    {
      id: nanoid(),
      username: "Daniel_Garcia",
      country: "Spain",
      status: "offline",
      lastSeen: Date.now() - 60000 * 120,
    },
  ]);

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

  useEffect(() => {
    if (user && !partner && !isFindingPartner) {
      mockFindPartner();
    }
  }, [user, partner, isFindingPartner]);

  const sendMessage = (text: string) => {
    if (!user || !partner) return;
    
    const filteredText = text;
    
    const newMessage = {
      id: nanoid(),
      sender: user.id,
      text: filteredText,
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

  const findNewPartner = () => {
    setPartner(null);
    mockFindPartner();
  };

  const reportPartner = (reason: string) => {
    if (!partner) return;
    console.log(`Reported ${partner.username} for: ${reason}`);
    findNewPartner();
  };

  const blockUser = (userId: string) => {
    setFriends(prevFriends => 
      prevFriends.map(friend => 
        friend.id === userId 
          ? { ...friend, blocked: true } 
          : friend
      )
    );
    
    if (partner && partner.id === userId) {
      findNewPartner();
    }
  };

  const unfriendUser = (userId: string) => {
    setFriends(prevFriends => prevFriends.filter(friend => friend.id !== userId));
    
    if (partner && partner.id === userId) {
      findNewPartner();
    }
  };

  const startDirectChat = (userId: string) => {
    const friend = friends.find(f => f.id === userId);
    if (friend && !friend.blocked) {
      setPartner({
        id: friend.id,
        username: friend.username,
        country: friend.country,
      });
      setIsConnected(true);
      setIsFindingPartner(false);
      
      setMessages([
        {
          id: nanoid(),
          sender: "system",
          text: `You are now connected with ${friend.username}`,
          timestamp: Date.now(),
          isOwn: false,
        },
      ]);
    }
  };

  const startVideoCall = (userId: string) => {
    const friend = friends.find(f => f.id === userId);
    if (friend && !friend.blocked) {
      setPartner({
        id: friend.id,
        username: friend.username,
        country: friend.country,
      });
      setIsConnected(true);
      setIsFindingPartner(false);
      
      setMessages([
        {
          id: nanoid(),
          sender: "system",
          text: `Video call initiated with ${friend.username}`,
          timestamp: Date.now(),
          isOwn: false,
        },
      ]);
    }
  };

  const addFriend = (userId: string) => {
    if (partner && partner.id === userId) {
      const newFriend: Friend = {
        id: partner.id,
        username: partner.username,
        country: partner.country,
        status: "online",
        lastSeen: Date.now(),
      };
      
      const isAlreadyFriend = friends.some(friend => friend.id === partner.id);
      
      if (!isAlreadyFriend) {
        setFriends(prevFriends => [...prevFriends, newFriend]);
      }
    }
  };

  const toggleLocationTracking = () => {
    setLocationEnabled(prev => !prev);
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
        sendMessage,
        setIsTyping,
        findNewPartner,
        reportPartner,
        toggleLocationTracking,
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
