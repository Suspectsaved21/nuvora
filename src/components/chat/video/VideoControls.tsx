
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, UserPlus, Maximize, Minimize, Split, ChevronRight } from "lucide-react";
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
  toggleSplitView: () => void;
  isSplitView: boolean;
  findNewPartner: () => void;
}

const VideoControls = ({
  videoEnabled,
  audioEnabled,
  isFullscreen,
  toggleVideo,
  toggleAudio,
  toggleFullscreen,
  handleAddFriend,
  toggleSplitView,
  isSplitView,
  findNewPartner
}: VideoControlsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "absolute left-0 right-0 flex justify-center items-center z-50", 
      isMobile ? "bottom-4 top-auto" : "bottom-16" 
    )}>
      <div className={cn(
        "px-4 py-3 rounded-full flex gap-3",
        "glass-morphism bg-black/70"
      )}>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVideo}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70",
            videoEnabled ? "bg-black/50" : "bg-red-500/70"
          )}
        >
          {videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAudio}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70",
            audioEnabled ? "bg-black/50" : "bg-red-500/70"
          )}
        >
          {audioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddFriend}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70",
            "bg-green-500/70"
          )}
          title="Add to Friends"
        >
          <UserPlus size={18} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSplitView}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70",
            isSplitView ? "bg-purple-500/70" : "bg-black/50"
          )}
          title={isSplitView ? "Exit Split View" : "Enter Split View"}
        >
          <Split size={18} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className={cn(
            "rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
          )}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={findNewPartner}
          className="rounded-full bg-blue-500/70 border-white/20 text-white hover:bg-blue-600/90"
          title="Find Next Partner"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;
