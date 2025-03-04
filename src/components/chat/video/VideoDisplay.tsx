
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
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Waiting for connection...
        </div>
      ) : (
        <>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            onClick={toggleFullscreen}
          />
          
          <div 
            className={cn(
              "absolute bottom-4 right-4 w-1/4 aspect-video rounded-lg overflow-hidden shadow-lg border border-white/10",
              isLocalFullscreen ? "fixed inset-0 z-50 w-full h-screen aspect-auto" : "",
              isMobile ? "w-1/3" : "w-1/4"
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
          
          {partner && (
            <div className="absolute top-4 left-4 glass-morphism px-3 py-1 rounded-full text-sm text-white">
              {partner.username} · {partner.country}
            </div>
          )}
          
          {/* Next/Previous User Navigation */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="ml-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-10"
              onClick={findNewPartner}
            >
              <ChevronLeft size={24} />
            </Button>
          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="mr-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-10"
              onClick={findNewPartner}
            >
              <ChevronRight size={24} />
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default VideoDisplay;
