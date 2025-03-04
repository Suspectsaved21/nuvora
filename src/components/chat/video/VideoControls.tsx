
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, UserPlus, Maximize, Minimize } from "lucide-react";

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
    <div className="absolute bottom-4 left-4 flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleVideo}
        className="bg-black/50 border-white/20 text-white hover:bg-black/70"
      >
        {videoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={toggleAudio}
        className="bg-black/50 border-white/20 text-white hover:bg-black/70"
      >
        {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleAddFriend}
        className="bg-black/50 border-white/20 text-white hover:bg-black/70"
        title="Add to Friends"
      >
        <UserPlus size={16} />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={toggleFullscreen}
        className="bg-black/50 border-white/20 text-white hover:bg-black/70"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
      </Button>
    </div>
  );
};

export default VideoControls;
