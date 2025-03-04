
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FullscreenButtonProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isLocalFullscreen: boolean;
  isMobile: boolean;
}

const FullscreenButton = ({ 
  isFullscreen, 
  toggleFullscreen, 
  isLocalFullscreen,
  isMobile 
}: FullscreenButtonProps) => {
  // Only show this button when both fullscreen states are false and not on mobile
  if (isFullscreen || isLocalFullscreen || isMobile) return null;
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFullscreen}
      className="absolute top-2 left-[calc(50%-1.5rem)] bg-black/50 border-white/20 text-white hover:bg-black/70 z-10 video-control-btn"
      title="Enter Fullscreen"
    >
      <Maximize size={16} />
    </Button>
  );
};

export default FullscreenButton;
