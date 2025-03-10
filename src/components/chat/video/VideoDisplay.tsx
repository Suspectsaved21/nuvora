
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
  const { findNewPartner } = useContext(ChatContext);
  
  return (
    <>
      {!isConnected ? (
        // When no connection, show the local video in full screen
        <div className="relative w-full h-full">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center text-white/70">
            Waiting for someone to join...
          </div>
        </div>
      ) : (
        // When connected, show split screen or mobile layout
        <div className="relative w-full h-full">
          {/* Remote video (partner) */}
          <div className={cn(
            "absolute transition-all duration-300 ease-in-out",
            isMobile ? "inset-0" : "inset-0 w-1/2" // Full width on mobile, 50% on desktop
          )}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              onClick={toggleFullscreen}
            />
          </div>
          
          {/* Local video (user) */}
          <div 
            className={cn(
              "transition-all duration-300 ease-in-out",
              isLocalFullscreen 
                ? "fixed inset-0 z-50 w-full h-screen aspect-auto" 
                : isMobile 
                  ? "absolute bottom-16 right-4 w-1/3 aspect-video rounded-lg" 
                  : "absolute top-0 right-0 w-1/2 h-full", // 50% width on desktop (right half)
              "overflow-hidden shadow-lg",
              isMobile ? "border border-white/10" : ""
            )}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleLocalFullscreen}
              className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-10"
              title={isLocalFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isLocalFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
          </div>
          
          {/* Partner info overlay */}
          {partner && (
            <div className="absolute top-4 left-4 glass-morphism px-3 py-1 rounded-full text-sm text-white z-10 flex items-center">
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
          
          {/* Next/Previous User Navigation */}
          <div className="absolute inset-y-0 left-0 flex items-center z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="ml-2 bg-black/50 border-white/20 text-white hover:bg-black/70"
              onClick={findNewPartner}
            >
              <ChevronLeft size={24} />
            </Button>
          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="mr-2 bg-black/50 border-white/20 text-white hover:bg-black/70"
              onClick={findNewPartner}
            >
              <ChevronRight size={24} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoDisplay;
