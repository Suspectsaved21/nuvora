
import { useRef, useState, useEffect, useContext } from "react";
import { toast } from "@/components/ui/use-toast";
import ChatContext from "@/context/ChatContext";
import { usePeerConnection } from "@/hooks/video/usePeerConnection";
import { useMediaStream } from "@/hooks/video/useMediaStream";
import { setupCallEventListeners } from "@/utils/videoUtils";

export function useVideoCall(isConnected: boolean, partner: { id: string } | null) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { findNewPartner } = useContext(ChatContext);
  
  // Use our new hooks
  const { peerInstance, isConnecting, connectToPeer } = usePeerConnection();
  const { 
    localStream, 
    videoEnabled, 
    audioEnabled, 
    initializeStream, 
    toggleVideo, 
    toggleAudio 
  } = useMediaStream();
  
  // Setup video streams
  useEffect(() => {
    if (!peerInstance) return;
    
    const setupVideoCall = async () => {
      try {
        // Initialize local stream
        await initializeStream(localVideoRef);
        
        // Setup incoming call handler
        peerInstance.onIncomingCall((call: any) => {
          console.log("Received incoming call from:", call.peer);
          
          if (localStream) {
            peerInstance.answerCall(call, localStream);
            setupCallEventListeners(call, remoteVideoRef, findNewPartner);
          }
        });
      } catch (error) {
        console.error("Error setting up video call:", error);
        toast({
          variant: "destructive",
          description: "Failed to access camera/microphone. Please check permissions."
        });
      }
    };
    
    setupVideoCall();
  }, [peerInstance, localStream, findNewPartner]);
  
  // Connect to partner when partner changes and connection is established
  useEffect(() => {
    if (!peerInstance || !partner || !isConnected || !localStream) return;
    
    const connect = async () => {
      const call = await connectToPeer(partner.id);
      
      if (call) {
        setupCallEventListeners(call, remoteVideoRef, findNewPartner);
      } else {
        console.log("Partner not found or not available for video");
        toast({
          description: "Partner not available for video chat. Finding someone else."
        });
        findNewPartner();
      }
    };
    
    connect();
  }, [partner, isConnected, peerInstance, localStream, connectToPeer, findNewPartner]);

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
