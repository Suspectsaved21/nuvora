
import { nanoid } from "nanoid";
import { Partner, Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a mock partner with randomly assigned attributes
 */
export const createMockPartner = (): Partner => {
  return {
    id: nanoid(),
    username: `User_${Math.floor(Math.random() * 10000)}`,
    country: ["USA", "Canada", "UK", "Australia", "Germany", "Japan"][
      Math.floor(Math.random() * 6)
    ],
    language: ["English", "Spanish", "French", "German", "Japanese"][
      Math.floor(Math.random() * 5)
    ],
  };
};

/**
 * Generates a random response from the partner
 */
export const generatePartnerResponse = (partnerId: string): Message => {
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
  
  return {
    id: nanoid(),
    sender: partnerId,
    text: responses[Math.floor(Math.random() * responses.length)],
    timestamp: Date.now(),
    isOwn: false,
  };
};

/**
 * Attempts to find a random partner from the database
 */
export const findRandomPartner = async (): Promise<Partner | null> => {
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
      
      return {
        id: randomUser.id,
        username: randomUser.username,
        country: ["USA", "Canada", "UK", "Australia", "Germany", "Japan"][
          Math.floor(Math.random() * 6)
        ],
        language: ["English", "Spanish", "French", "German", "Japanese"][
          Math.floor(Math.random() * 5)
        ],
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error finding partner:", error);
    return null;
  }
};

/**
 * Saves a message to the database
 */
export const saveMessageToDatabase = async (
  userId: string, 
  partnerId: string, 
  text: string
): Promise<void> => {
  if (!partnerId || partnerId.length < 10) return;
  
  try {
    await supabase.from('messages').insert({
      sender_id: userId,
      receiver_id: partnerId,
      content: text,
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

/**
 * Fetches messages between user and partner from the database
 */
export const fetchMessagesFromDatabase = async (
  partnerId: string
): Promise<Message[] | null> => {
  if (!partnerId || partnerId.length < 10) return null;
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${partnerId},receiver_id.eq.${partnerId}`)
      .order('created_at', { ascending: true })
      .limit(50);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(msg => ({
        id: msg.id,
        sender: msg.sender_id,
        text: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
        isOwn: msg.sender_id !== partnerId,
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null;
  }
};
