
import { useRef, useState, useEffect, useContext } from "react";
import { initPeer, setupVideoCall, handleRemoteStream, cleanupMedia } from "@/lib/peerjs";
import { ChatContext } from "@/context/chat";
import { toast } from "@/components/ui/use-toast";
import AuthContext from "@/context/AuthContext";

export function useVideoCall(isConnected: boolean, partner: { id: string } | null) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [peerInstance, setPeerInstance] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<Error | null>(null);
  const { findNewPartner } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  
  // Automatically set up the video call when the component mounts
  useEffect(() => {
    if (!user) {
      setIsInitializing(false);
      return;
    }
    
    let localStreamRef: MediaStream | null = null;
    let peer: any = null;
    let isCancelled = false;
    
    const initializeVideoCall = async () => {
      try {
        setIsInitializing(true);
        setInitError(null);
        
        // Initialize the peer with the user's ID
        const userId = `user_${user.id}`;
        peer = initPeer(userId);
        
        if (isCancelled) return;
        setPeerInstance(peer);
        
        // Set up the video call with local and remote video elements
        const { localStream } = await setupVideoCall(localVideoRef, remoteVideoRef);
        if (isCancelled) {
          if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
          }
          return;
        }
        
        localStreamRef = localStream;
        
        // Handle incoming calls
        peer.onIncomingCall((call: any) => {
          console.log("Received incoming call from:", call.peer);
          try {
            peer.answerCall(call, localStream);
            
            call.on('stream', (remoteStream: MediaStream) => {
              console.log("Received remote stream from call");
              handleRemoteStream(remoteVideoRef, remoteStream);
            });
            
            call.on('close', () => {
              console.log('Call closed by remote peer');
              // Find a new partner when the call is closed
              if (!isCancelled) {
                findNewPartner();
              }
            });
            
            call.on('error', (err: any) => {
              console.error("Call error:", err);
              if (!isCancelled) {
                toast({
                  variant: "destructive",
                  description: "Call error occurred. Reconnecting..."
                });
                findNewPartner();
              }
            });
          } catch (error) {
            console.error("Error answering call:", error);
            if (!isCancelled) {
              toast({
                variant: "destructive",
                description: "Failed to answer call. Please refresh the page."
              });
            }
          }
        });
        
        // If we have a partner, attempt to connect to them
        if (partner && isConnected && !isCancelled) {
          connectToPartner(partner.id, peer, localStream);
        }
        
        setIsInitializing(false);
      } catch (error) {
        console.error("Error setting up video call:", error);
        if (!isCancelled) {
          setInitError(error as Error);
          toast({
            variant: "destructive",
            description: "Failed to set up video call. Please check your camera and microphone permissions."
          });
          setIsInitializing(false);
        }
      }
    };
    
    initializeVideoCall();
    
    // Clean up when the component unmounts
    return () => {
      isCancelled = true;
      
      if (localStreamRef) {
        cleanupMedia();
      }
      
      if (peer) {
        peer.destroy();
      }
      
      setIsInitializing(false);
    };
  }, [user]);
  
  // Connect to partner when they change or connection status changes
  useEffect(() => {
    if (!peerInstance || !partner || !isConnected || isInitializing || initError) return;
    
    const connectWithRetry = async () => {
      try {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream;
          await connectToPartner(partner.id, peerInstance, stream);
        }
      } catch (error) {
        console.error("Error connecting to partner:", error);
        toast({
          variant: "destructive",
          description: "Failed to connect to partner. Trying someone else..."
        });
        findNewPartner();
      }
    };
    
    connectWithRetry();
  }, [partner, isConnected, peerInstance, isInitializing, initError]);
  
  // Function to connect to a specific partner
  const connectToPartner = async (partnerId: string, peer: any, localStream: MediaStream) => {
    try {
      const partnerPeerId = `user_${partnerId}`;
      console.log("Attempting to connect to partner:", partnerPeerId);
      
      const call = peer.connect(partnerPeerId);
      
      if (call) {
        console.log("Call created successfully");
        
        call.on('stream', (remoteStream: MediaStream) => {
          console.log("Received remote stream from connection");
          handleRemoteStream(remoteVideoRef, remoteStream);
        });
        
        call.on('close', () => {
          console.log('Call closed');
        });
        
        call.on('error', (err: any) => {
          console.error("Call connection error:", err);
          toast({
            variant: "destructive",
            description: "Connection lost. Finding a new partner..."
          });
          findNewPartner();
        });
      } else {
        console.error("Failed to create call");
        throw new Error("Failed to create call");
      }
    } catch (error) {
      console.error("Error connecting to partner:", error);
      throw error;
    }
  };

  // Toggle video on/off
  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };
  
  // Toggle audio on/off
  const toggleAudio = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => {
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
    isInitializing,
    initError
  };
}
