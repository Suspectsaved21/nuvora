
import { nanoid } from "nanoid";
import { Partner, Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a mock partner with randomly assigned attributes
 */
export const createMockPartner = (): Partner => {
  const randomId = nanoid();
  const countries = ["USA", "Canada", "UK", "Australia", "Germany", "Japan", "France", "Brazil", "Italy"];
  const languages = ["English", "Spanish", "French", "German", "Japanese", "Portuguese", "Italian"];
  
  return {
    id: randomId,
    username: `User_${Math.floor(Math.random() * 10000)}`,
    country: countries[Math.floor(Math.random() * countries.length)],
    language: languages[Math.floor(Math.random() * languages.length)],
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
    "I like your profile picture!",
    "Do you enjoy video chats?",
    "Have you been using Nuvora for long?",
    "What brings you here today?",
    "I'd love to chat more often!",
    "What do you think about this platform?",
    "That's a great point of view."
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
    // Find users who are active and available for matching
    const { data, error } = await supabase
      .from('active_users')
      .select('user_id, status')
      .eq('status', 'available')
      .order('last_seen', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Randomly select one of the active users
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomUserId = data[randomIndex].user_id;
      
      // Get the user's profile information
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('username, country, language')
        .eq('id', randomUserId)
        .single();
      
      if (userError) throw userError;
      
      if (userData) {
        return {
          id: randomUserId,
          username: userData.username || `User_${randomUserId.substring(0, 4)}`,
          country: userData.country,
          language: userData.language,
        };
      }
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
  text: string,
  messageType: 'user' | 'system' = 'user'
): Promise<void> => {
  if (!partnerId || partnerId.length < 10) return;
  
  try {
    await supabase.from('messages').insert({
      sender_id: userId,
      receiver_id: partnerId,
      content: text,
      is_system_message: messageType === 'system',
    });
    
    // Update the last message in the chat record
    await supabase.from('chats').upsert({
      user_id: userId,
      partner_id: partnerId,
      last_message: text.substring(0, 100), // Trim long messages
      last_message_time: new Date().toISOString(),
      is_active: true
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

/**
 * Fetches messages between user and partner from the database
 */
export const fetchMessagesFromDatabase = async (
  userId: string,
  partnerId: string
): Promise<Message[] | null> => {
  if (!partnerId || partnerId.length < 10) return null;
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true })
      .limit(100);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(msg => ({
        id: msg.id.toString(),
        sender: msg.sender_id,
        text: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
        isOwn: msg.sender_id === userId,
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null;
  }
};
