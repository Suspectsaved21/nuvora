
import { useState } from "react";
import { Friend } from "@/types/chat";
import { nanoid } from "nanoid";

export function useFriendManagement() {
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

  const blockUser = (userId: string) => {
    setFriends(prevFriends => 
      prevFriends.map(friend => 
        friend.id === userId 
          ? { ...friend, blocked: true } 
          : friend
      )
    );
  };

  const unfriendUser = (userId: string) => {
    setFriends(prevFriends => prevFriends.filter(friend => friend.id !== userId));
  };

  const addFriend = (userId: string, friendData: Partial<Friend>) => {
    const isAlreadyFriend = friends.some(friend => friend.id === userId);
    
    if (!isAlreadyFriend) {
      const newFriend: Friend = {
        id: userId,
        username: friendData.username || `User_${userId.substring(0, 4)}`,
        country: friendData.country,
        status: "online",
        lastSeen: Date.now(),
      };
      
      setFriends(prevFriends => [...prevFriends, newFriend]);
    }
  };

  return {
    friends,
    blockUser,
    unfriendUser,
    addFriend
  };
}
