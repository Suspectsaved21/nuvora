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
import OnlineUsersCount from "./OnlineUsersCount";
import NavigationButtons from "./video/NavigationButtons";

const VideoChat = () => {
  const { partner, isConnected, addFriend, findNewPartner, isFindingPartner, reportPartner } = useContext(ChatContext);
  const videoChatRef = useRef<HTMLDivElement>(null);
  const localVideoChatRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isChatVisible, setIsChatVisible] = useState(!isMobile);
  const [isSplitView, setIsSplitView] = useState(false);
  
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

  const handleReportPartner = () => {
    if (partner) {
      reportPartner("inappropriate behavior");
      toast({
        title: "Report Sent",
        description: "Thank you for your report. We'll review it shortly.",
      });
    }
  };

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };
  
  const toggleSplitView = () => {
    setIsSplitView(!isSplitView);
  };
  
  useEffect(() => {
    if (isMobile && videoChatRef.current) {
      const timer = setTimeout(() => {
        try {
          if (videoChatRef.current) {
            requestFullscreen(videoChatRef.current);
          }
        } catch (error) {
          console.error("Failed to request fullscreen:", error);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, requestFullscreen]);
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full mb-4 fixed top-20 left-0 right-0 flex justify-center z-50">
        <OnlineUsersCount />
      </div>
      
      <div 
        ref={videoChatRef}
        className={cn(
          "relative w-full bg-nexablack rounded-lg overflow-hidden",
          isFullscreen || isLocalFullscreen ? "fixed inset-0 z-50 h-screen" : "",
          isMobile ? "h-[calc(100vh-120px)]" : "aspect-video",
          isSplitView && !(isFullscreen || isLocalFullscreen) ? "omegle-split-screen" : ""
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
            handleReportPartner={handleReportPartner}
            isMobile={isMobile}
            isSplitView={isSplitView}
            toggleSplitView={toggleSplitView}
            isFindingPartner={isFindingPartner}
          />
        </div>
        
        {isConnected && (
          <VideoControls
            videoEnabled={videoEnabled}
            audioEnabled={audioEnabled}
            isFullscreen={isFullscreen || isLocalFullscreen}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            toggleFullscreen={isLocalFullscreen ? toggleLocalFullscreen : toggleFullscreen}
            handleAddFriend={handleAddFriend}
            toggleSplitView={toggleSplitView}
            isSplitView={isSplitView}
            findNewPartner={findNewPartner}
          />
        )}

        {!isConnected && !isFullscreen && !isLocalFullscreen && (
          <NavigationButtons 
            findNewPartner={findNewPartner} 
            isFindingPartner={isFindingPartner} 
          />
        )}

        <VideoFooter 
          isFullscreen={isFullscreen || isLocalFullscreen}
          toggleChatVisibility={toggleChatVisibility}
          isChatVisible={isChatVisible}
        />
      </div>
    </div>
  );
};

export default VideoChat;
