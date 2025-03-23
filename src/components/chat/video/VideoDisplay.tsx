
import { useContext } from "react";
import { Minimize, Split } from "lucide-react";
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
  handleReportPartner?: () => void;
  isMobile: boolean;
  isSplitView: boolean;
  toggleSplitView: () => void;
  isFindingPartner: boolean;
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
  handleReportPartner,
  isMobile,
  isSplitView,
  toggleSplitView,
  isFindingPartner
}: VideoDisplayProps) => {
  const { findNewPartner } = useContext(ChatContext);
  
  if (!isConnected || isFindingPartner) {
    return <WaitingScreen localVideoRef={localVideoRef} isFindingPartner={isFindingPartner} />;
  }
  
  return (
    <div className={`relative w-full h-full ${isSplitView ? 'omegle-split-screen' : ''}`}>
      {/* Remote video (partner) */}
      <RemoteVideo 
        remoteVideoRef={remoteVideoRef}
        isFullscreen={isFullscreen}
        isLocalFullscreen={isLocalFullscreen}
        toggleFullscreen={toggleFullscreen}
        isMobile={isMobile}
        isSplitView={isSplitView}
      />
      
      {/* Local video (user) */}
      <LocalVideo 
        localVideoRef={localVideoRef}
        isFullscreen={isFullscreen}
        isLocalFullscreen={isLocalFullscreen}
        toggleLocalFullscreen={toggleLocalFullscreen}
        isMobile={isMobile}
        isSplitView={isSplitView}
      />
      
      {/* Partner info overlay */}
      {partner && !isLocalFullscreen && (
        <PartnerInfo 
          partner={partner} 
          handleAddFriend={handleAddFriend} 
          reportPartner={handleReportPartner}
        />
      )}
      
      {/* Split View Button */}
      {!isLocalFullscreen && !isFullscreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSplitView}
          className="absolute top-4 right-4 bg-black/50 border-white/20 text-white hover:bg-black/70 z-40 rounded-full"
          title={isSplitView ? "Exit Split View" : "Enter Split View"}
        >
          <Split size={16} />
        </Button>
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
