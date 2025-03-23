
import { useState, useEffect, useRef } from "react";

export function useMediaStream(audioOnly: boolean = false) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Initialize media stream
  const initializeStream = async (
    localVideoRef: React.RefObject<HTMLVideoElement>
  ) => {
    // Get local media stream with retry mechanism
    const getMediaWithRetry = async (retries = 3): Promise<MediaStream> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: !audioOnly ? { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          } : false, 
          audio: true 
        });
        
        // Store locally for reuse
        setLocalStream(stream);
        
        // Set local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.muted = true; // Avoid feedback loop
          localVideoRef.current.play().catch(err => console.error("Error playing local video:", err));
        }
        
        return stream;
      } catch (err) {
        console.error("Error accessing media devices:", err);
        if (retries > 0) {
          console.log(`Retrying getUserMedia (${retries} attempts left)...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return getMediaWithRetry(retries - 1);
        }
        throw err;
      }
    };
    
    return getMediaWithRetry();
  };
  
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
  
  // Cleanup media streams
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [localStream]);

  return {
    localStream,
    videoEnabled,
    audioEnabled,
    initializeStream,
    toggleVideo,
    toggleAudio
  };
}
