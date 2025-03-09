
import { RefObject } from "react";

interface WaitingScreenProps {
  localVideoRef: RefObject<HTMLVideoElement>;
  isFindingPartner: boolean;
}

const WaitingScreen = ({ localVideoRef, isFindingPartner }: WaitingScreenProps) => {
  return (
    <div className="relative w-full h-full">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center text-white/70 bg-black/40 backdrop-blur-sm">
        {isFindingPartner ? 
          "Finding a new partner..." : 
          "Waiting for someone to join..."}
      </div>
    </div>
  );
};

export default WaitingScreen;
