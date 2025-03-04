
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoNavigationProps {
  findNewPartner: () => void;
  isLocalFullscreen: boolean;
}

const VideoNavigation = ({ findNewPartner, isLocalFullscreen }: VideoNavigationProps) => {
  if (isLocalFullscreen) return null;
  
  return (
    <>
      <div className="absolute inset-y-0 left-0 flex items-center z-40">
        <Button 
          variant="outline" 
          size="icon" 
          className="ml-2 bg-black/50 border-white/20 text-white hover:bg-black/70 video-control-btn"
          onClick={findNewPartner}
        >
          <ChevronLeft size={24} />
        </Button>
      </div>
      
      <div className="absolute inset-y-0 right-0 flex items-center z-40">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-2 bg-black/50 border-white/20 text-white hover:bg-black/70 video-control-btn"
          onClick={findNewPartner}
        >
          <ChevronRight size={24} />
        </Button>
      </div>
    </>
  );
};

export default VideoNavigation;
