
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
          <div className="absolute inset-0 flex items-center justify-center text-white/70 bg-black/40 backdrop-blur-sm">
            {isFindingPartner ? 
              "Finding a new partner..." : 
              "Waiting for someone to join..."}
          </div>
        </div>
      ) : (
        // Connected view with improved layout
        <div className="relative w-full h-full">
          {/* Remote video (partner) */}
          <div className={cn(
            "absolute transition-all duration-300 ease-in-out",
            isMobile && !isFullscreen && !isLocalFullscreen 
              ? "inset-0 w-full h-full" // Full screen on mobile by default
              : !isMobile && !isFullscreen && !isLocalFullscreen 
                ? "inset-0 w-full h-full" // Also fullscreen on desktop for better viewing
                : isLocalFullscreen 
                  ? "w-1/4 h-1/4 bottom-20 right-4 z-20 rounded-lg border border-white/10" 
                  : "inset-0 w-full h-full z-30" // Always fullscreen for remote
          )}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              onClick={toggleFullscreen}
            />
            
            {!isFullscreen && !isLocalFullscreen && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-10 min-h-8 min-w-8"
                title="Enter Fullscreen"
              >
                <Maximize size={14} />
              </Button>
            )}
          </div>
          
          {/* Local video (user) - improved positioning */}
          <div 
            className={cn(
              "transition-all duration-300 ease-in-out",
              isMobile && !isFullscreen && !isLocalFullscreen 
                ? "absolute w-1/3 aspect-video bottom-20 right-4 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg z-40" 
                : !isMobile && !isFullscreen && !isLocalFullscreen 
                  ? "absolute w-1/4 aspect-video bottom-20 right-4 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg z-40" 
                  : isFullscreen 
                    ? "absolute w-1/4 aspect-video bottom-20 right-4 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg z-40" 
                    : "fixed inset-0 z-50 w-full h-full" // For local fullscreen
            )}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover cursor-pointer"
              onClick={toggleLocalFullscreen}
            />
            
            {!isLocalFullscreen && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleLocalFullscreen}
                className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-10 min-h-8 min-w-8"
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
                className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-60"
                title="Exit Fullscreen"
              >
                <Minimize size={16} />
              </Button>
            )}
          </div>
          
          {/* Partner info overlay - show on top of everything */}
          {partner && !isLocalFullscreen && (
            <div className="absolute top-4 left-4 glass-morphism px-3 py-1 rounded-full text-sm text-white z-40 flex items-center gap-2">
              <span className="truncate max-w-40">{partner.username || 'Anonymous'} · {partner.country || 'Unknown'}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddFriend}
                className="bg-green-500/70 hover:bg-green-600/90 border-0 text-white rounded-full h-6 px-2 py-0 text-xs"
              >
                <UserPlus size={12} className="mr-1" />
                <span>Add</span>
              </Button>
            </div>
          )}
          
          {/* Next/Previous User Navigation - positioned better for mobile */}
          {!isLocalFullscreen && (
            <>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-40 rounded-full h-10 w-10"
                onClick={findNewPartner}
              >
                <ChevronLeft size={20} />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-40 rounded-full h-10 w-10"
                onClick={findNewPartner}
              >
                <ChevronRight size={20} />
              </Button>
            </>
          )}

          {/* Fullscreen exit button for the remote video */}
          {isFullscreen && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-40"
              title="Exit Fullscreen"
            >
              <Minimize size={16} />
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default VideoDisplay;
