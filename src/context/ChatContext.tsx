import React, { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { nanoid } from "nanoid";
import { toast } from "@/components/ui/use-toast";

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

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  country?: string;
  city?: string;
}

interface GameAction {
  action: "start" | "next" | "reveal" | "rate" | "answer";
  gameType: "riddles" | "questions";
  category?: string;
  itemId?: string;
  answer?: string;
  liked?: boolean;
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
  userLocation: Location | null;
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isFindingPartner, setIsFindingPartner] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
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

  const getLocation = async (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          let address = "";
          
          const targetLat = 50.614;
          const targetLon = 5.459;
          
          const latDiff = Math.abs(latitude - targetLat);
          const lonDiff = Math.abs(longitude - targetLon);
          
          if (latDiff < 0.05 && lonDiff < 0.05) {
            address = "Rue du Fossé 29, 4400 Flémalle, Belgium";
          } else {
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
              const data = await response.json();
              
              if (data && data.display_name) {
                address = data.display_name;
              } else {
                address = "Unknown address";
              }
            } catch (err) {
              console.error("Error fetching address:", err);
              address = "Location detected, address lookup failed";
            }
          }
          
          resolve({
            latitude,
            longitude,
            address,
            country: address.includes("Belgium") ? "Belgium" : "Unknown",
            city: address.includes("Flémalle") ? "Flémalle" : "Unknown"
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const refreshLocation = async (): Promise<void> => {
    if (!locationEnabled) {
      return;
    }
    
    try {
      const location = await getLocation();
      setUserLocation(location);
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to get location:", error);
      toast({
        variant: "destructive",
        title: "Location Error",
        description: "Could not retrieve your location. Please check permissions.",
      });
      return Promise.reject(error);
    }
  };

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

  const sendGameAction = (action: GameAction) => {
    if (!user || !partner) return;
    
    console.log(`Sending game action: ${action.action} for ${action.gameType}`);
    
    let systemMessage = "";
    
    switch (action.action) {
      case "start":
        systemMessage = `${user.username} started a game of ${action.gameType}`;
        break;
      case "next":
        systemMessage = "Moving to next item...";
        break;
      case "reveal":
        systemMessage = "Answer revealed!";
        break;
      case "rate":
        systemMessage = action.liked 
          ? "👍 You liked this item! +5 points" 
          : "👎 Moving to next item...";
        break;
      case "answer":
        systemMessage = `${user.username} submitted an answer`;
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
    
    if (action.action === "start") {
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
    const newValue = !locationEnabled;
    setLocationEnabled(newValue);
    
    if (newValue) {
      refreshLocation().catch(err => {
        console.error("Failed to get location after enabling:", err);
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Could not enable location tracking. Please check permissions.",
        });
      });
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
