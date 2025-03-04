
import { useRef, useEffect, useContext } from "react";
import { UserPlus, Maximize, Minimize, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ChatContext from "@/context/ChatContext";

interface VideoDisplayProps {
  isConnected: boolean;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  partner: { username?: string; country?: string; id: string } | null;
  isFullscreen: boolean;
  isLocalFullscreen: boolean;
  toggleFullscreen: () => void;
  toggleLocalFullscreen: () => void;
  handleAddFriend: () => void;
  isMobile: boolean;
}

const VideoDisplay = ({
  isConnected,
  remoteVideoRef,
  localVideoRef,
  partner,
  isFullscreen,
  isLocalFullscreen,
  toggleFullscreen,
  toggleLocalFullscreen,
  handleAddFriend,
  isMobile
}: VideoDisplayProps) => {
  const { findNewPartner, isFindingPartner } = useContext(ChatContext);
  
  return (
    <>
      {!isConnected || isFindingPartner ? (
        // When no connection or finding partner, show local video prominently
        <div className="relative w-full h-full">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white/70">
            {isFindingPartner ? "Finding a new partner..." : "Waiting for someone to join..."}
          </div>
        </div>
      ) : (
        // When connected, use Omegle-like split layout
        <div className="relative w-full h-full omegle-split-screen">
          {/* Remote video (partner) */}
          <div className={cn(
            "absolute transition-all duration-300 ease-in-out video-transition",
            isMobile && !isFullscreen && !isLocalFullscreen ? "inset-0 w-full h-1/2 top-0" : "",
            !isMobile && !isFullscreen && !isLocalFullscreen ? "inset-0 w-1/2" : "",
            isLocalFullscreen ? "w-1/4 h-1/4 bottom-4 right-4 z-20 rounded-lg border border-white/10" : "",
            isFullscreen ? "inset-0 w-full h-full z-30" : ""
          )}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover remote-video"
            />
            
            {!isFullscreen && !isLocalFullscreen && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-10 video-control-btn"
                title="Enter Fullscreen"
              >
                <Maximize size={14} />
              </Button>
            )}
          </div>
          
          {/* Local video (user) */}
          <div 
            className={cn(
              "transition-all duration-300 ease-in-out video-transition",
              isMobile && !isFullscreen && !isLocalFullscreen ? "absolute w-full h-1/2 bottom-0 left-0" : "",
              !isMobile && !isFullscreen && !isLocalFullscreen ? "absolute top-0 right-0 w-1/2 h-full" : "",
              isFullscreen ? "w-1/4 h-1/4 absolute bottom-4 right-4 z-40 rounded-lg border border-white/10" : "",
              isLocalFullscreen ? "fixed inset-0 z-50 w-full h-full" : ""
            )}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover local-video"
            />
            
            {!isFullscreen && !isLocalFullscreen && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleLocalFullscreen}
                className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-10 video-control-btn"
                title="Enter Fullscreen"
              >
                <Maximize size={14} />
              </Button>
            )}
            
            {isLocalFullscreen && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleLocalFullscreen}
                className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-60 video-control-btn"
                title="Exit Fullscreen"
              >
                <Minimize size={16} />
              </Button>
            )}
          </div>
          
          {/* Partner info overlay - show on top of everything */}
          {partner && !isLocalFullscreen && (
            <div className="absolute top-4 left-4 glass-morphism px-3 py-1 rounded-full text-sm text-white z-40 flex items-center">
              <span>{partner.username} · {partner.country || 'Unknown'}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddFriend}
                className="ml-2 bg-green-500/70 hover:bg-green-600/90 border-0 text-white rounded-full h-6 px-2 py-0 text-xs"
              >
                <UserPlus size={12} className="mr-1" />
                <span>Add Friend</span>
              </Button>
            </div>
          )}
          
          {/* Next/Previous User Navigation - adjust z-index to ensure visibility */}
          {!isLocalFullscreen && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center z-40">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-2 bg-black/50 border-white/20 text-white hover:bg-black/70 video-control-btn"
                  onClick={findNewPartner}
                >
                  <ChevronLeft size={24} />
                </Button>
              </div>
              
              <div className="absolute inset-y-0 right-0 flex items-center z-40">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="mr-2 bg-black/50 border-white/20 text-white hover:bg-black/70 video-control-btn"
                  onClick={findNewPartner}
                >
                  <ChevronRight size={24} />
                </Button>
              </div>
            </>
          )}

          {/* Fullscreen exit button for the remote video */}
          {isFullscreen && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-40 video-control-btn"
              title="Exit Fullscreen"
            >
              <Minimize size={16} />
            </Button>
          )}

          {/* Fullscreen enter button for the remote video */}
          {!isFullscreen && !isLocalFullscreen && !isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              className="absolute top-2 left-[calc(50%-1.5rem)] bg-black/50 border-white/20 text-white hover:bg-black/70 z-10 video-control-btn"
              title="Enter Fullscreen"
            >
              <Maximize size={16} />
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default VideoDisplay;
