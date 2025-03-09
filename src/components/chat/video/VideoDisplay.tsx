
import { useContext } from "react";
import { Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatContext from "@/context/ChatContext";
import RemoteVideo from "./RemoteVideo";
import LocalVideo from "./LocalVideo";
import PartnerInfo from "./PartnerInfo";
import NavigationButtons from "./NavigationButtons";
import WaitingScreen from "./WaitingScreen";

interface VideoDisplayProps {
  isConnected: boolean;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  partner: { username?: string; country?: string; id: string } | null;
  isFullscreen: boolean;
  isLocalFullscreen: boolean;
  toggleFullscreen: () => void;
  toggleLocalFullscreen: () => void;
  handleAddFriend: () => void;
  isMobile: boolean;
}

const VideoDisplay = ({
  isConnected,
  remoteVideoRef,
  localVideoRef,
  partner,
  isFullscreen,
  isLocalFullscreen,
  toggleFullscreen,
  toggleLocalFullscreen,
  handleAddFriend,
  isMobile
}: VideoDisplayProps) => {
  const { findNewPartner, isFindingPartner } = useContext(ChatContext);
  
  if (!isConnected || isFindingPartner) {
    return <WaitingScreen localVideoRef={localVideoRef} isFindingPartner={isFindingPartner} />;
  }
  
  return (
    <div className="relative w-full h-full">
      {/* Remote video (partner) */}
      <RemoteVideo 
        remoteVideoRef={remoteVideoRef}
        isFullscreen={isFullscreen}
        isLocalFullscreen={isLocalFullscreen}
        toggleFullscreen={toggleFullscreen}
        isMobile={isMobile}
      />
      
      {/* Local video (user) */}
      <LocalVideo 
        localVideoRef={localVideoRef}
        isFullscreen={isFullscreen}
        isLocalFullscreen={isLocalFullscreen}
        toggleLocalFullscreen={toggleLocalFullscreen}
        isMobile={isMobile}
      />
      
      {/* Partner info overlay */}
      {partner && !isLocalFullscreen && (
        <PartnerInfo partner={partner} handleAddFriend={handleAddFriend} />
      )}
      
      {/* Next/Previous User Navigation */}
      {!isLocalFullscreen && (
        <NavigationButtons findNewPartner={findNewPartner} />
      )}

      {/* Fullscreen exit button for the remote video */}
      {isFullscreen && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-40"
          title="Exit Fullscreen"
        >
          <Minimize size={16} />
        </Button>
      )}
    </div>
  );
};

export default VideoDisplay;
