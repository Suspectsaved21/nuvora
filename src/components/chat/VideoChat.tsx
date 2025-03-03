
import { useRef, useEffect, useContext, useState } from "react";
import { setupVideoCall } from "@/lib/peerjs";
import ChatContext from "@/context/ChatContext";
import { VideoOff, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoChat = () => {
  const { partner, isConnected } = useContext(ChatContext);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  
  useEffect(() => {
    if (!isConnected) return;
    
    const videoChatSetup = setupVideoCall(localVideoRef, remoteVideoRef);
    
    return () => {
      videoChatSetup.cleanup();
    };
  }, [isConnected]);
  
  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };
  
  return (
    <div className="relative w-full aspect-video bg-nexablack rounded-lg overflow-hidden">
      {!isConnected ? (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Waiting for connection...
        </div>
      ) : (
        <>
          {/* Remote video takes up the full container */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Local video is smaller and in the corner */}
          <div className="absolute bottom-4 right-4 w-1/4 aspect-video rounded-lg overflow-hidden shadow-lg border border-white/10">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Video controls */}
          <div className="absolute bottom-4 left-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVideo}
              className="bg-black/50 border-white/20 text-white hover:bg-black/70"
            >
              {videoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
            </Button>
          </div>
          
          {/* Partner info */}
          {partner && (
            <div className="absolute top-4 left-4 glass-morphism px-3 py-1 rounded-full text-sm text-white">
              {partner.username} · {partner.country}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoChat;
