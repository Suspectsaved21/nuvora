
import { Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FullscreenExitButtonProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const FullscreenExitButton = ({ isFullscreen, toggleFullscreen }: FullscreenExitButtonProps) => {
  if (!isFullscreen) return null;
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFullscreen}
      className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-40 video-control-btn"
      title="Exit Fullscreen"
    >
      <Minimize size={16} />
    </Button>
  );
};

export default FullscreenExitButton;
