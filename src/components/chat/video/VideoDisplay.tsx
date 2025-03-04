
import { useContext } from "react";
import ChatContext from "@/context/ChatContext";
import WaitingScreen from "./WaitingScreen";
import ConnectedVideoDisplay from "./ConnectedVideoDisplay";

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
  const { isFindingPartner } = useContext(ChatContext);
  
  return (
    <>
      {!isConnected || isFindingPartner ? (
        // When no connection or finding partner, show waiting screen
        <WaitingScreen 
          localVideoRef={localVideoRef}
          isFindingPartner={isFindingPartner}
        />
      ) : (
        // When connected, use Omegle-like split layout
        <ConnectedVideoDisplay
          remoteVideoRef={remoteVideoRef}
          localVideoRef={localVideoRef}
          partner={partner}
          isFullscreen={isFullscreen}
          isLocalFullscreen={isLocalFullscreen}
          toggleFullscreen={toggleFullscreen}
          toggleLocalFullscreen={toggleLocalFullscreen}
          handleAddFriend={handleAddFriend}
          isMobile={isMobile}
        />
      )}
    </>
  );
};

export default VideoDisplay;
