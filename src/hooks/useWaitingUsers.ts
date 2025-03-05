
import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { toast } from 'sonner';

export interface WaitingUser {
  id: string;
  peer_id: string;
  is_available: boolean;
  inserted_at: string;
}

export function useWaitingUsers(ownPeerId: string) {
  const [waitingUsers, setWaitingUsers] = useState<WaitingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch initial waiting users
  useEffect(() => {
    const fetchWaitingUsers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('waiting_users')
          .select('*')
          .neq('peer_id', ownPeerId)
          .eq('is_available', true);

        if (error) throw error;
        
        setWaitingUsers(data || []);
      } catch (err) {
        console.error('Error fetching waiting users:', err);
        setError(err as Error);
        toast.error('Failed to load waiting users');
      } finally {
        setIsLoading(false);
      }
    };

    if (ownPeerId) {
      fetchWaitingUsers();
    }
  }, [ownPeerId]);

  // Setup real-time subscription
  useEffect(() => {
    if (!ownPeerId) return;

    console.log('Setting up real-time subscription for waiting users');
    
    const channel = supabase
      .channel('waiting-users-changes')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'waiting_users',
          filter: `peer_id=neq.${ownPeerId}`
        }, 
        (payload) => {
          console.log('New waiting user:', payload.new);
          setWaitingUsers(prev => [...prev, payload.new as WaitingUser]);
        }
      )
      .on('postgres_changes', 
        {
          event: 'DELETE',
          schema: 'public',
          table: 'waiting_users'
        }, 
        (payload) => {
          console.log('User removed from waiting list:', payload.old);
          setWaitingUsers(prev => 
            prev.filter(user => user.peer_id !== (payload.old as WaitingUser).peer_id)
          );
        }
      )
      .on('postgres_changes', 
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'waiting_users'
        }, 
        (payload) => {
          console.log('Waiting user updated:', payload.new);
          setWaitingUsers(prev => 
            prev.map(user => 
              user.peer_id === (payload.new as WaitingUser).peer_id 
                ? payload.new as WaitingUser 
                : user
            )
          );
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to waiting users changes');
        }
        
        if (status === 'CHANNEL_ERROR') {
          console.error('Failed to subscribe to waiting users changes');
          toast.error('Failed to connect to real-time updates');
        }
      });

    return () => {
      console.log('Removing waiting users subscription');
      supabase.removeChannel(channel);
    };
  }, [ownPeerId]);

  return { waitingUsers, isLoading, error };
}
