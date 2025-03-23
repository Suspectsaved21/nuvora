
import { useState, useEffect, useContext } from "react";
import { toast } from "@/components/ui/use-toast";
import AuthContext from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";

interface PeerInstance {
  connect: (peerId: string) => any;
  answerCall: (call: any, stream: MediaStream) => void;
  onIncomingCall: (callback: (call: any) => void) => void;
  reconnect: () => void;
  disconnect: () => void;
  destroy: () => void;
}

export function usePeerConnection() {
  const [peerInstance, setPeerInstance] = useState<PeerInstance | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useContext(AuthContext);
  
  // Initialize peer connection
  useEffect(() => {
    if (!user) return;
    
    const setupPeer = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { initPeer } = await import('@/lib/peerjs');
        
        // Initialize the peer with the user's ID
        const userId = `user_${user.id}_${nanoid(6)}`;
        const peer = initPeer(userId);
        
        if (peer) {
          setPeerInstance(peer);
          
          // Register the user as available for video chat
          await supabase.from('active_users').upsert({
            user_id: user.id,
            peer_id: userId,
            status: 'available',
            last_seen: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Error setting up peer connection:", error);
        toast({
          variant: "destructive",
          description: "Failed to initialize video chat. Please refresh and try again."
        });
      }
    };
    
    setupPeer();
    
    // Cleanup on unmount
    return () => {
      if (peerInstance) {
        peerInstance.destroy();
      }
      
      // Remove user from active users on disconnect
      if (user) {
        supabase.from('active_users').delete().eq('user_id', user.id);
      }
    };
  }, [user]);

  const connectToPeer = async (partnerId: string) => {
    if (!peerInstance) return null;
    
    try {
      setIsConnecting(true);
      
      // Fetch partner's peer ID from the database
      const { data } = await supabase
        .from('active_users')
        .select('peer_id')
        .eq('user_id', partnerId)
        .single();
      
      if (data && data.peer_id) {
        console.log("Attempting to connect to partner:", data.peer_id);
        return peerInstance.connect(data.peer_id);
      }
      
      return null;
    } catch (error) {
      console.error("Error connecting to peer:", error);
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    peerInstance,
    isConnecting,
    connectToPeer
  };
}
