import { useState, useEffect } from "react";
import { Partner, Message } from "@/types/chat";
import { nanoid } from "nanoid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function usePartnerManagement() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isFindingPartner, setIsFindingPartner] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const findPartner = async () => {
    setIsFindingPartner(true);
    setIsConnected(false);
    setPartner(null);
    setMessages([]);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username')
        .not('is_guest', 'eq', true)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomUser = data[randomIndex];
        
        const mockPartner: Partner = {
          id: randomUser.id,
          username: randomUser.username,
          country: ["USA", "Canada", "UK", "Australia", "Germany", "Japan"][
            Math.floor(Math.random() * 6)
          ],
          language: ["English", "Spanish", "French", "German", "Japanese"][
            Math.floor(Math.random() * 5)
          ],
        };
        
        setPartner(mockPartner);
        setIsConnected(true);
        
        setMessages([
          {
            id: nanoid(),
            sender: "system",
            text: `You are now connected with ${mockPartner.username}`,
            timestamp: Date.now(),
            isOwn: false,
          },
        ]);
      } else {
        mockFindPartner();
      }
    } catch (error) {
      console.error("Error finding partner:", error);
      mockFindPartner();
    } finally {
      setIsFindingPartner(false);
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
      try {
        await supabase.from('messages').insert({
          sender_id: userId,
          receiver_id: partner.id,
          content: text,
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    }
    
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

  useEffect(() => {
    const fetchMessages = async () => {
      if (!partner || !partner.id || partner.id.length < 10) return;
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${partner.id},receiver_id.eq.${partner.id}`)
          .order('created_at', { ascending: true })
          .limit(50);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            sender: msg.sender_id,
            text: msg.content,
            timestamp: new Date(msg.created_at).getTime(),
            isOwn: msg.sender_id !== partner.id,
          }));
          
          setMessages(prev => {
            const systemMessages = prev.filter(msg => msg.sender === 'system');
            return [...systemMessages, ...formattedMessages];
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    
    fetchMessages();
  }, [partner]);

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

  const reportPartner = async (reason: string) => {
    if (!partner) return;
    
    if (partner.id && partner.id.length > 10) {
      try {
        toast({
          description: `Report submitted. Finding you a new partner.`,
        });
      } catch (error) {
        console.error("Error reporting partner:", error);
      }
    }
    
    findPartner();
  };

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
    startDirectChat(userId, username, country);
    
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
    findPartner,
    sendMessage,
    sendGameAction,
    reportPartner,
    startDirectChat,
    startVideoCall,
    setMessages
  };
}
