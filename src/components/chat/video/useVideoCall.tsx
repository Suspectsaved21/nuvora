
import { useRef, useState, useEffect } from "react";
import { initPeer, setupVideoCall, handleRemoteStream, cleanupMedia } from "@/lib/peerjs";

export function useVideoCall(isConnected: boolean, partner: { id: string } | null) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [peerInstance, setPeerInstance] = useState<any>(null);
  
  useEffect(() => {
    if (!isConnected || !partner) return;
    
    const userId = `user_${Math.random().toString(36).substring(2, 9)}`;
    const peer = initPeer(userId);
    setPeerInstance(peer);
    
    const initCall = async () => {
      try {
        const { localStream } = await setupVideoCall(localVideoRef, remoteVideoRef);
        
        peer.onIncomingCall((call) => {
          peer.answerCall(call, localStream);
          
          call.on('stream', (remoteStream: MediaStream) => {
            handleRemoteStream(remoteVideoRef, remoteStream);
          });
          
          call.on('close', () => {
            console.log('Call closed');
          });
        });
        
        if (partner && partner.id) {
          const partnerId = `partner_${partner.id}`;
          const call = peer.connect(partnerId);
          
          if (call) {
            call.on('stream', (remoteStream: MediaStream) => {
              handleRemoteStream(remoteVideoRef, remoteStream);
            });
          }
        }
      } catch (error) {
        console.error("Error setting up call:", error);
      }
    };
    
    initCall();
    
    return () => {
      cleanupMedia();
      if (peerInstance) {
        peerInstance.destroy();
      }
    };
  }, [isConnected, partner]);

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };
  
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
    toggleAudio
  };
}
