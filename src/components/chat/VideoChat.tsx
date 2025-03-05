
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
        title: "Friend Request Sent",
        description: `Friend request sent to ${partner.username}.`,
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
          isFullscreen || isLocalFullscreen ? "fixed inset-0 z-50 h-screen aspect-auto" : "",
          isMobile ? "h-[calc(100vh-120px)]" : ""
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
        
        {/* Only show video controls when connected */}
        {isConnected && (
          <VideoControls
            videoEnabled={videoEnabled}
            audioEnabled={audioEnabled}
            isFullscreen={isFullscreen || isLocalFullscreen}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            toggleFullscreen={isLocalFullscreen ? toggleLocalFullscreen : toggleFullscreen}
            handleAddFriend={handleAddFriend}
          />
        )}

        <VideoFooter 
          isFullscreen={isFullscreen || isLocalFullscreen}
          toggleChatVisibility={toggleChatVisibility}
          isChatVisible={isChatVisible}
        />
      </div>
    </>
  );
};

export default VideoChat;
