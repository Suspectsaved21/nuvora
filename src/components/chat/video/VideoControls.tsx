
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, UserPlus, Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center gap-2 z-40">
      <div className="glass-morphism px-4 py-2 rounded-full flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVideo}
          className={cn(
            "rounded-full border-white/20 text-white hover:bg-black/70",
            videoEnabled ? "bg-black/50" : "bg-red-500/70"
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
            audioEnabled ? "bg-black/50" : "bg-red-500/70"
          )}
        >
          {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddFriend}
          className="rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
          title="Add to Friends"
        >
          <UserPlus size={16} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;
