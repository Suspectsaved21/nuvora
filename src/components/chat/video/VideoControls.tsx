
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
      isMobile ? "bottom-16" : "bottom-24" 
    )}>
      <div className={cn(
        "px-3 py-2 rounded-full flex gap-2",
        "glass-morphism bg-black/70"
      )}>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVideo}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70 h-10 w-10",
            videoEnabled ? "bg-black/50" : "bg-red-500/70"
          )}
        >
          {videoEnabled ? <Video size={isMobile ? 16 : 18} /> : <VideoOff size={isMobile ? 16 : 18} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAudio}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70 h-10 w-10",
            audioEnabled ? "bg-black/50" : "bg-red-500/70"
          )}
        >
          {audioEnabled ? <Mic size={isMobile ? 16 : 18} /> : <MicOff size={isMobile ? 16 : 18} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddFriend}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70 h-10 w-10",
            "bg-green-500/70"
          )}
          title="Add to Friends"
        >
          <UserPlus size={isMobile ? 16 : 18} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSplitView}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70 h-10 w-10",
            isSplitView ? "bg-purple-500/70" : "bg-black/50"
          )}
          title={isSplitView ? "Exit Split View" : "Enter Split View"}
        >
          <Split size={isMobile ? 16 : 18} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className={cn(
            "rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70 h-10 w-10"
          )}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize size={isMobile ? 16 : 18} /> : <Maximize size={isMobile ? 16 : 18} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={findNewPartner}
          className="rounded-full bg-blue-500/70 border-white/20 text-white hover:bg-blue-600/90 h-10 w-10"
          title="Find Next Partner"
        >
          <ChevronRight size={isMobile ? 16 : 18} />
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;
