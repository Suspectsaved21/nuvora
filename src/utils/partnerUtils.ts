
import { nanoid } from "nanoid";
import { Partner, Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

// List of countries for random selection when creating mock partners
const COUNTRIES = [
  "USA", "Canada", "UK", "Australia", "Germany", "Japan", "France", "Italy", 
  "Spain", "Brazil", "Mexico", "Russia", "China", "India", "South Korea",
  "Egypt", "Nigeria", "Kenya", "South Africa", "Argentina", "Chile"
];

// List of languages for random selection
const LANGUAGES = [
  "English", "Spanish", "French", "German", "Japanese", "Chinese", 
  "Russian", "Arabic", "Portuguese", "Italian", "Korean"
];

/**
 * Creates a mock partner with randomly assigned attributes
 * @param options Matching options (worldwide or country-specific)
 */
export const createMockPartner = (options: { worldwide: boolean, userCountry: string | null }): Partner => {
  let country;
  
  if (options.worldwide || !options.userCountry) {
    // Select random country if worldwide matching or user country is unknown
    country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  } else {
    // For regional matching, use the user's country
    country = options.userCountry;
  }
  
  return {
    id: nanoid(),
    username: `User_${Math.floor(Math.random() * 10000)}`,
    country: country,
    language: LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)],
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
    "Have you traveled much?",
    "What languages do you speak?",
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
 * @param options Matching options (worldwide or country-specific)
 */
export const findRandomPartner = async (options: { worldwide: boolean, userCountry: string | null }): Promise<Partner | null> => {
  try {
    // First check if the country column exists in the profiles table
    const { data: columnCheck, error: columnError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (columnError) {
      console.error("Error checking profiles table:", columnError);
      return null;
    }
    
    // Query users from profiles table
    let query = supabase
      .from('profiles')
      .select('id, username, country')
      .not('is_guest', 'eq', true)
      .order('created_at', { ascending: false })
      .limit(20);
    
    // If regional matching is enabled and we know the user's country, filter by country
    if (!options.worldwide && options.userCountry) {
      query = query.eq('country', options.userCountry);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Database query error:", error);
      return null;
    }
    
    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomUser = data[randomIndex];
      
      // Use the country from the database if available, otherwise assign random one
      const country = randomUser.country || COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      
      return {
        id: randomUser.id,
        username: randomUser.username,
        country: country,
        language: LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)],
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
