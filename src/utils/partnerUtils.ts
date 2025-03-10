
import { nanoid } from "nanoid";
import { Partner, Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

/**
 * Find a random partner from active users
 */
export async function findRandomPartner(): Promise<Partner | null> {
  try {
    // Get a random user who is online
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, country')
      .eq('online_status', true)
      .limit(10);
    
    if (error) {
      console.error("Error finding partner:", error);
      return null;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // Select a random user from the results
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomUser = data[randomIndex];
    
    return {
      id: randomUser.id,
      username: randomUser.username || 'Anonymous',
      country: randomUser.country,
    };
  } catch (error) {
    console.error("Error finding random partner:", error);
    return null;
  }
}

/**
 * Create a mock partner with random data
 */
export function createMockPartner(): Partner {
  const names = [
    "Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Lucas",
    "Mia", "Jackson", "Isabella", "Aiden", "Riley", "Caden", "Aria"
  ];
  
  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany",
    "France", "Spain", "Italy", "Japan", "Brazil", "Mexico", "India"
  ];
  
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomCountry = countries[Math.floor(Math.random() * countries.length)];
  
  return {
    id: nanoid(),
    username: randomName,
    country: randomCountry,
  };
}

/**
 * Save a message to the database
 */
export async function saveMessageToDatabase(
  senderId: string, 
  receiverId: string, 
  content: string,
  messageType: 'user' | 'system' = 'user'
) {
  try {
    // Only save real messages to the database
    if (receiverId && receiverId.length > 10) {
      const { error } = await supabase.from('messages').insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
        is_read: false
      });
      
      if (error) {
        console.error("Error saving message:", error);
      }
    }
  } catch (error) {
    console.error("Error in saveMessageToDatabase:", error);
  }
}

/**
 * Generate a response from the partner
 */
export function generatePartnerResponse(partnerId: string): Message {
  const responses = [
    "Hi there! How are you doing today?",
    "Nice to meet you! What brings you here?",
    "Hello! Where are you from?",
    "Hey! What do you like to do for fun?",
    "Hi! Have you been using this app for long?",
    "Hello! I'm new here. How about you?",
    "Hi! What's the weather like where you are?",
    "Hey there! What are your hobbies?",
    "Nice to connect with you! What's your favorite movie?",
    "Hello! What kind of music do you listen to?"
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    id: nanoid(),
    sender: partnerId,
    text: randomResponse,
    timestamp: Date.now(),
    isOwn: false,
  };
}

/**
 * Format a timestamp into a readable time
 */
export function formatMessageTime(timestamp: number): string {
  return format(new Date(timestamp), 'h:mm a');
}

/**
 * Fetch messages between two users from the database
 */
export async function fetchMessagesFromDatabase(userId: string, partnerId: string): Promise<Message[] | null> {
  try {
    // Only fetch messages for real partners
    if (partnerId && partnerId.length > 10) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .or(`sender_id.eq.${partnerId},receiver_id.eq.${partnerId}`)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error("Error fetching messages:", error);
        return null;
      }
      
      if (data && data.length > 0) {
        // Transform database messages to our Message format
        return data.map(msg => ({
          id: msg.id,
          sender: msg.sender_id,
          text: msg.content,
          timestamp: new Date(msg.created_at).getTime(),
          isOwn: msg.sender_id === userId,
        }));
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching messages from database:", error);
    return null;
  }
}
