
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
import { Maximize, Minimize, Loader2, SkipForward, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoChat = () => {
  const { 
    partner, 
    isConnected, 
    addFriend, 
    findNewPartner, 
    cancelFindPartner, 
    isFindingPartner 
  } = useContext(ChatContext);
  const videoChatRef = useRef<HTMLDivElement>(null);
  const localVideoChatRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isChatVisible, setIsChatVisible] = useState(!isMobile);
  
  const { isFullscreen, toggleFullscreen, requestFullscreen } = useFullscreen(videoChatRef);
  const { isFullscreen: isLocalFullscreen, toggleFullscreen: toggleLocalFullscreen } = useFullscreen(localVideoChatRef);
  
  const {
    localVideoRef,
    remoteVideoRef,
    videoEnabled,
    audioEnabled,
    toggleVideo,
    toggleAudio,
    isConnecting
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
        title: "Friend Request Sent",
        description: `Friend request sent to ${partner.username}.`,
      });
    }
  };

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleFindNewPartner = () => {
    // User manually initiates partner search
    findNewPartner();
  };
  
  const handleCancelFindPartner = () => {
    // User manually cancels partner search
    cancelFindPartner();
  };
  
  return (
    <>
      <div 
        ref={videoChatRef}
        className={cn(
          "relative w-full aspect-video bg-[#121212] rounded-lg overflow-hidden shadow-xl",
          isFullscreen || isMobile ? "fixed inset-0 z-50 h-screen aspect-auto" : ""
        )}
      >
        {/* Ome.TV style header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent px-4 py-2 z-40 flex justify-between items-center">
          <div className="text-white font-bold text-lg">Nuvora</div>
          <div className="flex items-center space-x-2">
            {isFindingPartner ? (
              <div className="flex items-center text-white text-sm">
                <Loader2 className="animate-spin mr-2" size={16} />
                Finding a partner...
              </div>
            ) : (
              <div className="text-white text-sm">
                {isConnected ? "Connected" : "Disconnected"}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="ml-2 bg-black/50 border-white/20 text-white hover:bg-black/70"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
          </div>
        </div>
        
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
            handleFindNewPartner={handleFindNewPartner}
            isMobile={isMobile}
            isFindingPartner={isFindingPartner}
            handleCancelFindPartner={handleCancelFindPartner}
          />
        </div>
        
        {/* Video controls - always visible */}
        <VideoControls
          videoEnabled={videoEnabled}
          audioEnabled={audioEnabled}
          isFullscreen={isFullscreen}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
          toggleFullscreen={toggleFullscreen}
          handleAddFriend={handleAddFriend}
          handleFindNewPartner={handleFindNewPartner}
          handleCancelFindPartner={handleCancelFindPartner}
          isFindingPartner={isFindingPartner}
        />

        {/* Add prominent partner search button overlay */}
        {!isConnected && !isFindingPartner && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30">
            <Button 
              onClick={handleFindNewPartner}
              className="bg-purple hover:bg-purple-dark px-8 py-6 text-lg rounded-full shadow-xl"
            >
              <SkipForward size={24} className="mr-2" />
              Start Random Chat
            </Button>
          </div>
        )}
        
        {/* Searching overlay */}
        {isFindingPartner && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-30">
            <div className="animate-spin mb-4">
              <Loader2 size={40} className="text-white" />
            </div>
            <p className="text-white text-xl mb-4">Finding a partner...</p>
            <Button 
              variant="destructive"
              onClick={handleCancelFindPartner}
            >
              <X size={16} className="mr-2" />
              Cancel Search
            </Button>
          </div>
        )}

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
