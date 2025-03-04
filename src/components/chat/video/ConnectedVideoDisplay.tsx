
import { useContext } from "react";
import { cn } from "@/lib/utils";
import ChatContext from "@/context/ChatContext";
import RemoteVideoDisplay from "./RemoteVideoDisplay";
import LocalVideoDisplay from "./LocalVideoDisplay";
import PartnerInfo from "./PartnerInfo";
import VideoNavigation from "./VideoNavigation";
import FullscreenButton from "./FullscreenButton";
import FullscreenExitButton from "./FullscreenExitButton";

interface ConnectedVideoDisplayProps {
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

const ConnectedVideoDisplay = ({
  remoteVideoRef,
  localVideoRef,
  partner,
  isFullscreen,
  isLocalFullscreen,
  toggleFullscreen,
  toggleLocalFullscreen,
  handleAddFriend,
  isMobile
}: ConnectedVideoDisplayProps) => {
  const { findNewPartner } = useContext(ChatContext);
  
  return (
    <div className="relative w-full h-full omegle-split-screen">
      {/* Remote video (partner) */}
      <RemoteVideoDisplay
        remoteVideoRef={remoteVideoRef}
        isFullscreen={isFullscreen}
        isLocalFullscreen={isLocalFullscreen}
        toggleFullscreen={toggleFullscreen}
        isMobile={isMobile}
      />
      
      {/* Local video (user) */}
      <LocalVideoDisplay
        localVideoRef={localVideoRef}
        isFullscreen={isFullscreen}
        isLocalFullscreen={isLocalFullscreen}
        toggleLocalFullscreen={toggleLocalFullscreen}
        isMobile={isMobile}
      />
      
      {/* Partner info overlay */}
      <PartnerInfo 
        partner={partner}
        handleAddFriend={handleAddFriend}
        isLocalFullscreen={isLocalFullscreen}
      />
      
      {/* Navigation buttons */}
      <VideoNavigation 
        findNewPartner={findNewPartner}
        isLocalFullscreen={isLocalFullscreen}
      />

      {/* Fullscreen exit button for the remote video */}
      <FullscreenExitButton 
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />

      {/* Fullscreen enter button for the remote video */}
      <FullscreenButton 
        isFullscreen={isFullscreen}
        isLocalFullscreen={isLocalFullscreen}
        toggleFullscreen={toggleFullscreen}
        isMobile={isMobile}
      />
    </div>
  );
};

export default ConnectedVideoDisplay;
