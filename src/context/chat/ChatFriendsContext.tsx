
import React, { createContext, useContext, useState, useEffect } from "react";
import { Friend } from "@/types/chat";
import AuthContext from "@/context/AuthContext";
import { useBlockUser } from "@/hooks/useBlockUser";
import { useUnfriendUser } from "@/hooks/useUnfriendUser";
import { useAddFriend } from "@/hooks/useAddFriend";
import { fetchFriendsList } from "@/services/friendService";
import { toast } from "@/components/ui/use-toast";

interface ChatFriendsContextType {
  friends: Friend[];
  blockUser: (userId: string) => void;
  unfriendUser: (userId: string) => void;
  addFriend: (userId: string, userData?: { username: string; country?: string }) => void;
  isLoading: boolean;
}

const ChatFriendsContext = createContext<ChatFriendsContextType>({
  friends: [],
  blockUser: () => {},
  unfriendUser: () => {},
  addFriend: () => {},
  isLoading: false
});

export const ChatFriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const { user } = useContext(AuthContext);
  
  const { blockUser, isBlocking } = useBlockUser(setFriends, user?.id);
  const { unfriendUser, isUnfriending } = useUnfriendUser(setFriends, user?.id);
  const { addFriend, isAdding } = useAddFriend(setFriends, user?.id);

  // Fetch friends on mount and when user changes
  useEffect(() => {
    if (!user) return;
    
    const loadFriends = async () => {
      const friendsList = await fetchFriendsList(user.id);
      setFriends(friendsList);
    };
    
    loadFriends();
  }, [user]);

  return (
    <ChatFriendsContext.Provider value={{
      friends,
      blockUser,
      unfriendUser,
      addFriend,
      isLoading: isBlocking || isUnfriending || isAdding
    }}>
      {children}
    </ChatFriendsContext.Provider>
  );
};

export const useChatFriends = () => useContext(ChatFriendsContext);

export default ChatFriendsContext;
