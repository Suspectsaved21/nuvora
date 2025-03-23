
import { useRef, useState, useEffect, useContext } from "react";
import { toast } from "@/components/ui/use-toast";
import ChatContext from "@/context/ChatContext";
import AuthContext from "@/context/AuthContext";
import { nanoid } from "nanoid";
import { supabase } from "@/integrations/supabase/client";

interface PeerInstance {
  connect: (peerId: string) => any;
  answerCall: (call: any, stream: MediaStream) => void;
  onIncomingCall: (callback: (call: any) => void) => void;
  reconnect: () => void;
  disconnect: () => void;
  destroy: () => void;
}

export function useVideoCall(isConnected: boolean, partner: { id: string } | null) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [peerInstance, setPeerInstance] = useState<PeerInstance | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { findNewPartner } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  
  // Initialize peer connection and setup video streams
  useEffect(() => {
    if (!user) return;
    
    const setupPeer = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { initPeer, setupVideoCall } = await import('@/lib/peerjs');
        
        // Initialize the peer with the user's ID
        const userId = `user_${user.id}_${nanoid(6)}`;
        const peer = initPeer(userId);
        
        if (peer) {
          setPeerInstance(peer);
          
          // Set up the video call with local and remote video elements
          const { localStream } = await setupVideoCall(localVideoRef, remoteVideoRef);
          setLocalStream(localStream);
          
          // Register the user as available for video chat
          await supabase.from('active_users').upsert({
            user_id: user.id,
            peer_id: userId,
            status: 'available',
            last_seen: new Date().toISOString()
          });
          
          // Setup incoming call handler
          peer.onIncomingCall((call: any) => {
            console.log("Received incoming call from:", call.peer);
            
            if (localStream) {
              peer.answerCall(call, localStream);
              
              call.on('stream', (remoteStream: MediaStream) => {
                console.log("Received remote stream from call");
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = remoteStream;
                  remoteVideoRef.current.play().catch(err => {
                    console.error("Error playing remote video:", err);
                  });
                }
              });
              
              call.on('close', () => {
                console.log('Call closed by remote peer');
                // Find a new partner when the call is closed
                findNewPartner();
              });
              
              call.on('error', (err: any) => {
                console.error("Call error:", err);
                toast({
                  variant: "destructive",
                  description: "Call error occurred. Please try again."
                });
              });
            }
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
      
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      }
      
      // Remove user from active users on disconnect
      if (user) {
        supabase.from('active_users').delete().eq('user_id', user.id);
      }
    };
  }, [user, findNewPartner]);
  
  // Connect to partner when partner changes and connection is established
  useEffect(() => {
    if (!peerInstance || !partner || !isConnected || !localStream) return;
    
    const connectToPartner = async () => {
      try {
        setIsConnecting(true);
        
        // Fetch partner's peer ID from the database
        const { data } = await supabase
          .from('active_users')
          .select('peer_id')
          .eq('user_id', partner.id)
          .single();
        
        if (data && data.peer_id) {
          console.log("Attempting to connect to partner:", data.peer_id);
          
          const call = peerInstance.connect(data.peer_id);
          
          if (call) {
            // Wait for the remote stream to be available
            call.on('stream', (remoteStream: MediaStream) => {
              console.log("Received remote stream from connection");
              
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play().catch(err => {
                  console.error("Error playing remote video:", err);
                });
              }
            });
            
            // Handle call closing
            call.on('close', () => {
              console.log('Call closed');
              // The remote peer closed the connection
              toast({
                description: "Call ended by the other user"
              });
            });
            
            // Handle errors in the call
            call.on('error', (err: any) => {
              console.error("Call connection error:", err);
              toast({
                variant: "destructive",
                description: "Connection error. Trying to find a new partner."
              });
              findNewPartner();
            });
          }
        } else {
          console.log("Partner not found or not available for video");
          toast({
            description: "Partner not available for video chat. Finding someone else."
          });
          findNewPartner();
        }
      } catch (error) {
        console.error("Error connecting to partner:", error);
      } finally {
        setIsConnecting(false);
      }
    };
    
    connectToPartner();
  }, [partner, isConnected, peerInstance, localStream, findNewPartner]);

  // Toggle video on/off
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };
  
  // Toggle audio on/off
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  return {
    localVideoRef,
    remoteVideoRef,
    videoEnabled,
    audioEnabled,
    toggleVideo,
    toggleAudio,
    isConnecting
  };
}
