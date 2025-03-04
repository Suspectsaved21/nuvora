
import { useState, useEffect, useContext } from "react";
import { Friend } from "@/types/chat";
import AuthContext from "@/context/AuthContext";
import { fetchFriendsList } from "@/services/friendService";
import { useBlockUser } from "@/hooks/useBlockUser";
import { useUnfriendUser } from "@/hooks/useUnfriendUser";
import { useAddFriend } from "@/hooks/useAddFriend";

export function useFriendManagement() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const { user } = useContext(AuthContext);
  
  const { blockUser, isBlocking } = useBlockUser(setFriends, user?.id);
  const { unfriendUser, isUnfriending } = useUnfriendUser(setFriends, user?.id);
  const { addFriend, isAdding } = useAddFriend(setFriends, user?.id);

  // Function to refresh the friends list
  const refreshFriends = async () => {
    if (!user) return;
    const friendsList = await fetchFriendsList(user.id);
    setFriends(friendsList);
  };

  // Fetch friends on mount and when user changes
  useEffect(() => {
    if (!user) return;
    refreshFriends();
  }, [user]);

  return {
    friends,
    blockUser,
    unfriendUser,
    addFriend,
    refreshFriends,
    isLoading: isBlocking || isUnfriending || isAdding
  };
}
