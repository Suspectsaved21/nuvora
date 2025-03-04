
import { useState, useEffect, useContext, useCallback } from "react";
import { Friend } from "@/types/chat";
import AuthContext from "@/context/AuthContext";
import { fetchFriendsList, subscribeFriendsOnlineStatus } from "@/services/friendService";
import { useBlockUser } from "@/hooks/useBlockUser";
import { useUnfriendUser } from "@/hooks/useUnfriendUser";
import { useAddFriend } from "@/hooks/useAddFriend";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function useFriendManagement() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const { user } = useContext(AuthContext);
  
  const { blockUser, isBlocking } = useBlockUser(setFriends, user?.id);
  const { unfriendUser, isUnfriending } = useUnfriendUser(setFriends, user?.id);
  const { addFriend, isAdding } = useAddFriend(setFriends, user?.id);
  const { onlineUsers } = useOnlineStatus(user?.id);

  // Function to refresh the friends list
  const refreshFriends = useCallback(async () => {
    if (!user) return;
    const friendsList = await fetchFriendsList(user.id);
    
    // Update friends with real-time online status
    const updatedFriends = friendsList.map(friend => ({
      ...friend,
      status: onlineUsers[friend.id] ? 'online' : friend.status
    }));
    
    setFriends(updatedFriends);
  }, [user, onlineUsers]);

  // Fetch friends on mount and when user changes
  useEffect(() => {
    if (!user) return;
    refreshFriends();
    
    // Subscribe to real-time updates for friends' online status
    const unsubscribe = subscribeFriendsOnlineStatus(user.id, refreshFriends);
    
    return () => {
      unsubscribe();
    };
  }, [user, refreshFriends]);

  // Update friends list when online status changes
  useEffect(() => {
    if (Object.keys(onlineUsers).length > 0) {
      setFriends(prevFriends => 
        prevFriends.map(friend => ({
          ...friend,
          status: onlineUsers[friend.id] ? 'online' : friend.status
        }))
      );
    }
  }, [onlineUsers]);

  return {
    friends,
    blockUser,
    unfriendUser,
    addFriend,
    refreshFriends,
    isLoading: isBlocking || isUnfriending || isAdding
  };
}
