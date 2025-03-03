
import { useState, useEffect, useContext } from "react";
import { Friend } from "@/types/chat";
import { nanoid } from "nanoid";
import { supabase } from "@/integrations/supabase/client";
import AuthContext from "@/context/AuthContext";

export function useFriendManagement() {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch friends list from Supabase
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) {
        setFriends([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Get friends from Supabase
        const { data, error } = await supabase
          .from('friends')
          .select(`
            id,
            friend_id,
            status,
            profiles:friend_id (
              id,
              username
            )
          `)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedFriends: Friend[] = data.map(friend => ({
            id: friend.friend_id,
            username: friend.profiles.username,
            status: Math.random() > 0.5 ? "online" : "offline", // Randomize status for demo
            lastSeen: Date.now() - Math.random() * 1000000, // Random last seen
            blocked: friend.status === 'blocked',
            country: ["USA", "Canada", "UK", "Australia", "Germany", "Japan"][
              Math.floor(Math.random() * 6)
            ], // Randomize country for demo
          }));
          
          setFriends(formattedFriends);
        } else {
          // Add mock friends for demo purposes
          const mockFriends = [
            {
              id: nanoid(),
              username: "Emma_Wilson",
              country: "Canada",
              status: "online" as const,
              lastSeen: Date.now(),
            },
            {
              id: nanoid(),
              username: "Alex_Thompson",
              country: "UK",
              status: "offline" as const,
              lastSeen: Date.now() - 60000 * 30,
            },
          ];
          
          setFriends(mockFriends);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        
        // Fallback to mock friends
        const mockFriends = [
          {
            id: nanoid(),
            username: "Emma_Wilson",
            country: "Canada",
            status: "online" as const,
            lastSeen: Date.now(),
          },
          {
            id: nanoid(),
            username: "Alex_Thompson",
            country: "UK",
            status: "offline" as const,
            lastSeen: Date.now() - 60000 * 30,
          },
        ];
        
        setFriends(mockFriends);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFriends();
  }, [user]);

  const blockUser = async (userId: string) => {
    // Check if the user is already a friend
    const existingFriend = friends.find(friend => friend.id === userId);
    
    if (user && userId.length > 10) {
      try {
        if (existingFriend) {
          if (existingFriend.blocked) {
            // Unblock the user
            await supabase
              .from('friends')
              .update({ status: 'active' })
              .eq('user_id', user.id)
              .eq('friend_id', userId);
            
            setFriends(prevFriends => 
              prevFriends.map(friend => 
                friend.id === userId 
                  ? { ...friend, blocked: false } 
                  : friend
              )
            );
          } else {
            // Block the user
            await supabase
              .from('friends')
              .update({ status: 'blocked' })
              .eq('user_id', user.id)
              .eq('friend_id', userId);
            
            setFriends(prevFriends => 
              prevFriends.map(friend => 
                friend.id === userId 
                  ? { ...friend, blocked: true } 
                  : friend
              )
            );
          }
        }
      } catch (error) {
        console.error("Error blocking/unblocking user:", error);
      }
    } else {
      // Local state update for demo
      setFriends(prevFriends => 
        prevFriends.map(friend => 
          friend.id === userId 
            ? { ...friend, blocked: !friend.blocked } 
            : friend
        )
      );
    }
  };

  const unfriendUser = async (userId: string) => {
    if (user && userId.length > 10) {
      try {
        await supabase
          .from('friends')
          .delete()
          .eq('user_id', user.id)
          .eq('friend_id', userId);
        
        setFriends(prevFriends => prevFriends.filter(friend => friend.id !== userId));
      } catch (error) {
        console.error("Error removing friend:", error);
      }
    } else {
      // Local state update for demo
      setFriends(prevFriends => prevFriends.filter(friend => friend.id !== userId));
    }
  };

  const addFriend = async (userId: string, friendData: Partial<Friend>) => {
    const isAlreadyFriend = friends.some(friend => friend.id === userId);
    
    if (!isAlreadyFriend) {
      if (user && userId.length > 10) {
        try {
          // Add friend to Supabase
          await supabase.from('friends').insert({
            user_id: user.id,
            friend_id: userId,
            status: 'active'
          });
          
          // Add to local state
          const newFriend: Friend = {
            id: userId,
            username: friendData.username || `User_${userId.substring(0, 4)}`,
            country: friendData.country,
            status: "online",
            lastSeen: Date.now(),
          };
          
          setFriends(prevFriends => [...prevFriends, newFriend]);
        } catch (error) {
          console.error("Error adding friend:", error);
        }
      } else {
        // Local state update for demo
        const newFriend: Friend = {
          id: userId,
          username: friendData.username || `User_${userId.substring(0, 4)}`,
          country: friendData.country,
          status: "online",
          lastSeen: Date.now(),
        };
        
        setFriends(prevFriends => [...prevFriends, newFriend]);
      }
    }
  };

  return {
    friends,
    blockUser,
    unfriendUser,
    addFriend,
    isLoading
  };
}
