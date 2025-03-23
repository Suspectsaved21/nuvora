
import { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";

interface RemoteVideoProps {
  remoteVideoRef: RefObject<HTMLVideoElement>;
  isFullscreen: boolean;
  isLocalFullscreen: boolean;
  toggleFullscreen: () => void;
  isMobile: boolean;
  isSplitView: boolean;
}

const RemoteVideo = ({
  remoteVideoRef,
  isFullscreen,
  isLocalFullscreen,
  toggleFullscreen,
  isMobile,
  isSplitView
}: RemoteVideoProps) => {
  return (
    <div className={cn(
      "absolute transition-all duration-300 ease-in-out",
      isSplitView && !isFullscreen && !isLocalFullscreen
        ? "w-full h-1/2 top-0 left-0 z-10" // Split view - top half
        : isMobile && !isFullscreen && !isLocalFullscreen 
          ? "inset-0 w-full h-full" // Full screen on mobile by default
          : !isMobile && !isFullscreen && !isLocalFullscreen 
            ? "inset-0 w-full h-full" // Also fullscreen on desktop for better viewing
            : isLocalFullscreen 
              ? "w-1/4 h-1/4 bottom-20 right-4 z-20 rounded-lg border border-white/10" 
              : "inset-0 w-full h-full z-30" // Always fullscreen for remote when in fullscreen mode
    )}>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        onClick={toggleFullscreen}
      />
      
      {!isFullscreen && !isLocalFullscreen && !isSplitView && (
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
  );
};

export default RemoteVideo;
