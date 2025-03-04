
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, UserPlus, Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface VideoControlsProps {
  videoEnabled: boolean;
  audioEnabled: boolean;
  isFullscreen: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleFullscreen: () => void;
  handleAddFriend: () => void;
}

const VideoControls = ({
  videoEnabled,
  audioEnabled,
  isFullscreen,
  toggleVideo,
  toggleAudio,
  toggleFullscreen,
  handleAddFriend
}: VideoControlsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "absolute left-0 right-0 flex justify-center items-center gap-2 z-50", // Increased z-index
      isMobile ? "bottom-4 top-auto" : "bottom-16" 
    )}>
      <div className={cn(
        "px-4 py-2 rounded-full flex gap-2",
        isMobile ? "bg-black/70" : "glass-morphism"
      )}>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVideo}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70",
            videoEnabled ? "bg-black/50" : "bg-red-500/70",
            "min-h-8 min-w-8" // Smaller touch targets for mobile
          )}
        >
          {videoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAudio}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70",
            audioEnabled ? "bg-black/50" : "bg-red-500/70",
            "min-h-8 min-w-8" // Smaller touch targets for mobile
          )}
        >
          {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddFriend}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70",
            isMobile ? "bg-green-500/70" : "bg-black/50",
            "min-h-8 min-w-8" // Smaller touch targets for mobile
          )}
          title="Add to Friends"
        >
          <UserPlus size={16} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className={cn(
            "rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70",
            "min-h-8 min-w-8" // Smaller touch targets for mobile
          )}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;
