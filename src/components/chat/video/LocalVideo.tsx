
import { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocalVideoProps {
  localVideoRef: RefObject<HTMLVideoElement>;
  isFullscreen: boolean;
  isLocalFullscreen: boolean;
  toggleLocalFullscreen: () => void;
  isMobile: boolean;
  isSplitView: boolean;
}

const LocalVideo = ({
  localVideoRef,
  isFullscreen,
  isLocalFullscreen,
  toggleLocalFullscreen,
  isMobile,
  isSplitView
}: LocalVideoProps) => {
  return (
    <div 
      className={cn(
        "transition-all duration-300 ease-in-out",
        isSplitView && !isFullscreen && !isLocalFullscreen
          ? "absolute w-full h-1/2 bottom-0 left-0 z-10" // Split view - bottom half
          : isMobile && !isFullscreen && !isLocalFullscreen 
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
        onClick={!isSplitView ? toggleLocalFullscreen : undefined}
      />
      
      {!isLocalFullscreen && !isSplitView && (
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
  );
};

export default LocalVideo;
