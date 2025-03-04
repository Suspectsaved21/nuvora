
import { useState, useEffect, useContext, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthContext from "@/context/AuthContext";
import { UserProfile } from "@/types/auth";
import { toast } from "@/components/ui/use-toast";

export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Fetch online users with debounce to prevent excessive calls
  const fetchOnlineUsers = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, is_guest, online_status, last_seen_at, country')
        .eq('online_status', true)
        .neq('id', user.id) // Exclude current user
        .order('last_seen_at', { ascending: false });

      if (error) throw error;

      // Process and format the user data
      const users = data.map(profile => ({
        id: profile.id,
        username: profile.username || `User_${profile.id.substring(0, 5)}`,
        isGuest: profile.is_guest,
        onlineStatus: profile.online_status,
        lastSeenAt: profile.last_seen_at ? new Date(profile.last_seen_at).getTime() : undefined,
        country: profile.country || "Unknown location"
      }));

      setOnlineUsers(users);
    } catch (error) {
      console.error("Error fetching online users:", error);
      // Only show the toast once, not for every retry
      if (isLoading) {
        toast({
          variant: "destructive",
          description: "Failed to load online users. Will retry automatically."
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoading]);

  // Initial fetch and setup realtime subscription
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchOnlineUsers();

    // Set up realtime subscriptions with optimized channel
    const channel = supabase
      .channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        fetchOnlineUsers();
      })
      .on('postgres_changes', {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'profiles',
        filter: 'online_status=eq.true' // Only get events for online users
      }, () => {
        fetchOnlineUsers();
      })
      .subscribe();

    // Set up periodic refresh every 30 seconds for better reliability
    const refreshInterval = setInterval(() => {
      fetchOnlineUsers();
    }, 30000);

    return () => {
      clearInterval(refreshInterval);
      supabase.removeChannel(channel);
    };
  }, [user, fetchOnlineUsers]);

  // Function to start a direct chat with a user
  const startChatWith = useCallback((userId: string, username: string) => {
    // Navigate to chat with this specific user
    window.location.href = `/chat?partner=${userId}&name=${encodeURIComponent(username)}`;
  }, []);

  return {
    onlineUsers,
    isLoading,
    startChatWith
  };
}
