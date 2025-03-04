
import { useRef } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RemoteVideoDisplayProps {
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  isFullscreen: boolean;
  isLocalFullscreen: boolean;
  toggleFullscreen: () => void;
  isMobile: boolean;
}

const RemoteVideoDisplay = ({
  remoteVideoRef,
  isFullscreen,
  isLocalFullscreen,
  toggleFullscreen,
  isMobile
}: RemoteVideoDisplayProps) => {
  return (
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
  );
};

export default RemoteVideoDisplay;
