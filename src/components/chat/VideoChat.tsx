
import { useRef, useEffect, useContext, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import ChatContext from "@/context/ChatContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFullscreen } from "./video/useFullscreen";
import { useVideoCall } from "./video/useVideoCall";
import VideoDisplay from "./video/VideoDisplay";
import VideoControls from "./video/VideoControls";
import VideoFooter from "./video/VideoFooter";
import { Maximize, Minimize } from "lucide-react";

const VideoChat = () => {
  const { partner, isConnected, addFriend } = useContext(ChatContext);
  const videoChatRef = useRef<HTMLDivElement>(null);
  const localVideoChatRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isChatVisible, setIsChatVisible] = useState(!isMobile);
  
  const { isFullscreen, toggleFullscreen, requestFullscreen } = useFullscreen(videoChatRef);
  const { 
    isFullscreen: isLocalFullscreen, 
    toggleFullscreen: toggleLocalFullscreen 
  } = useFullscreen(localVideoChatRef);
  
  const {
    localVideoRef,
    remoteVideoRef,
    videoEnabled,
    audioEnabled,
    toggleVideo,
    toggleAudio
  } = useVideoCall(isConnected, partner);
  
  // Auto fullscreen for mobile
  useEffect(() => {
    if (isMobile && videoChatRef.current) {
      requestFullscreen(videoChatRef.current);
    }
  }, [isMobile, requestFullscreen]);
  
  // Handle page reload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Chrome requires returnValue to be set
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  
  const handleAddFriend = () => {
    if (partner) {
      addFriend(partner.id);
      toast({
        title: "Friend Added",
        description: `${partner.username} was added to your friends list.`,
      });
    }
  };

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };
  
  return (
    <>
      <div 
        ref={videoChatRef}
        className={cn(
          "relative w-full aspect-video bg-nexablack rounded-lg overflow-hidden",
          isFullscreen || isMobile ? "fixed inset-0 z-50 h-screen aspect-auto" : ""
        )}
      >
        <div className="w-full h-full" ref={localVideoChatRef}>
          <VideoDisplay
            isConnected={isConnected}
            remoteVideoRef={remoteVideoRef}
            localVideoRef={localVideoRef}
            partner={partner}
            isFullscreen={isFullscreen}
            isLocalFullscreen={isLocalFullscreen}
            toggleFullscreen={toggleFullscreen}
            toggleLocalFullscreen={toggleLocalFullscreen}
            handleAddFriend={handleAddFriend}
            isMobile={isMobile}
          />
        </div>
        
        {/* Only show video controls when connected or in special cases */}
        <VideoControls
          videoEnabled={videoEnabled}
          audioEnabled={audioEnabled}
          isFullscreen={isFullscreen}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          toggleFullscreen={toggleFullscreen}
          handleAddFriend={handleAddFriend}
        />

        <VideoFooter 
          isFullscreen={isFullscreen}
          toggleChatVisibility={toggleChatVisibility}
          isChatVisible={isChatVisible}
        />
      </div>
    </>
  );
};

export default VideoChat;
