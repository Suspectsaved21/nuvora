
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, UserPlus, Maximize, Minimize, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoControlsProps {
  videoEnabled: boolean;
  audioEnabled: boolean;
  isFullscreen: boolean;
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleFullscreen: () => void;
  handleAddFriend: () => void;
  handleFindNewPartner: () => void;
  isFindingPartner: boolean;
}

const VideoControls = ({
  videoEnabled,
  audioEnabled,
  isFullscreen,
  toggleVideo,
  toggleAudio,
  toggleFullscreen,
  handleAddFriend,
  handleFindNewPartner,
  isFindingPartner
}: VideoControlsProps) => {
  return (
    <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center gap-2 z-40">
      <div className="glass-morphism px-4 py-2 rounded-full flex gap-3 bg-black/60">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVideo}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70 h-10 w-10",
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
            "rounded-full border-white/20 text-white hover:bg-black/70 h-10 w-10",
            audioEnabled ? "bg-black/50" : "bg-red-500/70"
          )}
        >
          {audioEnabled ? <Mic size={18} /> : <MicOff size={18} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddFriend}
          className="rounded-full bg-[#9b87f5]/70 border-white/20 text-white hover:bg-[#9b87f5]/90 h-10 w-10"
          title="Add to Friends"
        >
          <UserPlus size={18} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleFindNewPartner}
          className={cn(
            "rounded-full border-white/20 text-white h-10 w-10",
            isFindingPartner 
              ? "bg-yellow-500/70 hover:bg-yellow-500/90" 
              : "bg-[#9b87f5]/70 hover:bg-[#9b87f5]/90"
          )}
          disabled={isFindingPartner}
          title="Find New Partner"
        >
          <RefreshCw size={18} className={isFindingPartner ? "animate-spin" : ""} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70 h-10 w-10"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;
