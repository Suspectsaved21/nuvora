
import { RefObject } from "react";
import { Loader2 } from "lucide-react";

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
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/60 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-xl font-semibold mb-2">
          {isFindingPartner ? "Finding a new partner..." : "Waiting for someone to join..."}
        </p>
        <p className="text-sm opacity-80">
          Click "Next" to find another partner
        </p>
      </div>
    </div>
  );
};

export default WaitingScreen;
