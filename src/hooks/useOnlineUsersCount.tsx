
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useOnlineUsersCount() {
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchOnlineUsersCount = async () => {
    try {
      setIsLoading(true);
      
      // Query active_users table to get users who are online and available
      const { data, error, count } = await supabase
        .from('active_users')
        .select('*', { count: 'exact' })
        .eq('status', 'available');
      
      if (error) throw error;
      
      // Set the count of online users
      setOnlineCount(count || 0);
    } catch (error) {
      console.error("Error fetching online users count:", error);
      toast({
        variant: "destructive",
        description: "Failed to fetch online users count."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to changes in the active_users table
  useEffect(() => {
    fetchOnlineUsersCount();
    
    // Set up real-time subscription for online status updates
    const channel = supabase
      .channel('online-users-count')
      .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'active_users'
          }, 
          () => {
            // Update count when any active_users record changes
            fetchOnlineUsersCount();
          })
      .subscribe();
      
    // Refresh the count every 60 seconds
    const intervalId = setInterval(() => {
      fetchOnlineUsersCount();
    }, 60000);
    
    return () => {
      supabase.removeChannel(channel);
      clearInterval(intervalId);
    };
  }, []);

  return { onlineCount, isLoading };
}
