
import { useRef } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LocalVideoDisplayProps {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  isFullscreen: boolean;
  isLocalFullscreen: boolean;
  toggleLocalFullscreen: () => void;
  isMobile: boolean;
}

const LocalVideoDisplay = ({
  localVideoRef,
  isFullscreen,
  isLocalFullscreen,
  toggleLocalFullscreen,
  isMobile
}: LocalVideoDisplayProps) => {
  return (
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
  );
};

export default LocalVideoDisplay;
