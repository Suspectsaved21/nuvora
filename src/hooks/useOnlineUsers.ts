
import { useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthContext from "@/context/AuthContext";
import { UserProfile } from "@/types/auth";
import { toast } from "@/components/ui/use-toast";

export function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // Fetch all online users
  useEffect(() => {
    if (!user) return;

    const fetchOnlineUsers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('online_status', true)
          .neq('id', user.id); // Exclude current user

        if (error) throw error;

        const users = data.map(profile => ({
          id: profile.id,
          username: profile.username,
          isGuest: profile.is_guest,
          onlineStatus: profile.online_status,
          lastSeenAt: profile.last_seen_at ? new Date(profile.last_seen_at).getTime() : undefined,
          country: profile.country
        }));

        setOnlineUsers(users);
      } catch (error) {
        console.error("Error fetching online users:", error);
        toast({
          variant: "destructive",
          description: "Failed to load online users."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOnlineUsers();

    // Set up realtime subscription for online users updates
    const channel = supabase
      .channel('online-users-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: 'online_status=true'
      }, () => {
        fetchOnlineUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    onlineUsers,
    isLoading
  };
}
