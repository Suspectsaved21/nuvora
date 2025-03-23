
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface OnlineUser {
  user_id: string;
  online_at: string;
}

export function useOnlineStatus(userId?: string) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!userId) return;
    
    // Update our own online status
    const updateOnlineStatus = async () => {
      try {
        // First update the online_status in profiles
        await supabase
          .from('profiles')
          .update({ online_status: true })
          .eq('id', userId);
          
        // Then handle presence channel for real-time tracking
        const channel = supabase.channel('online-users');
        
        // Set up presence tracking
        channel
          .on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            const newOnlineStatus: Record<string, boolean> = {};
            
            // Convert presence state to our format
            Object.entries(state).forEach(([key, presences]) => {
              // The key is the user_id
              if (Array.isArray(presences) && presences.length > 0) {
                newOnlineStatus[key] = true;
              }
            });
            
            setOnlineUsers(newOnlineStatus);
          })
          .on('presence', { event: 'join' }, ({ key }) => {
            // When a user joins, mark them as online
            setOnlineUsers(prev => ({ ...prev, [key]: true }));
          })
          .on('presence', { event: 'leave' }, ({ key }) => {
            // When a user leaves, remove them from online users
            setOnlineUsers(prev => {
              const newState = { ...prev };
              delete newState[key];
              return newState;
            });
          });
          
        // Subscribe to the channel and track our own presence
        await channel.subscribe(async (status) => {
          if (status !== 'SUBSCRIBED') return;
          
          // Track our own presence
          const userStatus = {
            user_id: userId,
            online_at: new Date().toISOString(),
          };
          
          await channel.track(userStatus);
        });
        
        // Set up event listeners for page visibility changes
        const handleVisibilityChange = () => {
          if (!document.hidden && channel) {
            channel.track({
              user_id: userId,
              online_at: new Date().toISOString(), 
            });
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Set up online status update at regular intervals
        const intervalId = setInterval(async () => {
          if (channel) {
            await channel.track({
              user_id: userId,
              online_at: new Date().toISOString(),
            });
          }
        }, 60000); // Update every minute
        
        // When user is about to leave the page
        const handleBeforeUnload = async () => {
          try {
            // Update profile status to offline when leaving
            await supabase
              .from('profiles')
              .update({ 
                online_status: false,
                last_seen_at: new Date().toISOString()
              })
              .eq('id', userId);
          } catch (error) {
            console.error("Error updating offline status:", error);
          }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Cleanup function
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          clearInterval(intervalId);
          
          // Set status to offline and remove channel
          // Fix: Convert this to a proper Promise with .then and .catch
          const updateStatus = async () => {
            try {
              await supabase
                .from('profiles')
                .update({ 
                  online_status: false,
                  last_seen_at: new Date().toISOString()
                })
                .eq('id', userId);
                
              if (channel) {
                supabase.removeChannel(channel);
              }
            } catch (error) {
              console.error("Error cleaning up online status:", error);
            }
          };
          
          // Execute the async function
          updateStatus();
        };
      } catch (error) {
        console.error("Error in online status tracking:", error);
        toast({
          variant: "destructive",
          description: "Failed to update online status"
        });
      }
    };
    
    updateOnlineStatus();
  }, [userId]);

  return {
    onlineUsers,
    isUserOnline: (id: string) => !!onlineUsers[id]
  };
}
