
import { UserPlus, Maximize, Minimize, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  handleFindNewPartner: () => void;
  handleCancelFindPartner: () => void;
  isMobile: boolean;
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
  handleFindNewPartner,
  handleCancelFindPartner,
  isMobile,
  isFindingPartner
}: VideoDisplayProps) => {
  return (
    <>
      {!isConnected ? (
        // When no connection, show the local video in full screen with "looking for partner" overlay
        <div className="relative w-full h-full">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
            {isFindingPartner ? (
              <>
                <Loader2 className="animate-spin mb-4 text-purple-500" size={40} />
                <div className="text-xl font-semibold text-white mb-2">
                  Finding you a partner...
                </div>
                <Button 
                  onClick={handleCancelFindPartner}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white"
                >
                  Cancel Search
                </Button>
              </>
            ) : (
              <>
                <div className="text-xl font-semibold text-white mb-2">
                  Ready to connect?
                </div>
                <Button 
                  onClick={handleFindNewPartner}
                  className="mt-4 bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
                >
                  Start Random Chat
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        // When connected, show the video layout
        <div className="relative w-full h-full">
          {/* Remote video (partner) - take full screen */}
          <div className="absolute inset-0">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Local video (user) - corner position */}
          <div 
            className={cn(
              "transition-all duration-300 ease-in-out",
              isLocalFullscreen 
                ? "fixed inset-0 z-50 w-full h-screen aspect-auto" 
                : "absolute bottom-20 right-4 w-1/4 aspect-video rounded-lg",
              "overflow-hidden shadow-lg",
              "border-2 border-white/20"
            )}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleLocalFullscreen}
              className="absolute top-2 right-2 bg-black/50 border-white/20 text-white hover:bg-black/70 z-10"
              title={isLocalFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isLocalFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
          </div>
          
          {/* Partner info overlay */}
          {partner && (
            <div className="absolute top-16 left-4 glass-morphism px-3 py-2 rounded-lg text-sm text-white z-10 flex items-center bg-black/60">
              <div className="mr-2">
                <div className="font-semibold">{partner.username || "Anonymous"}</div>
                <div className="text-xs text-white/70">{partner.country || 'Unknown location'}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddFriend}
                className="ml-2 bg-[#9b87f5]/70 hover:bg-[#9b87f5]/90 border-0 text-white rounded-full h-7 px-3 py-0 text-xs"
              >
                <UserPlus size={12} className="mr-1" />
                <span>Add Friend</span>
              </Button>
            </div>
          )}
          
          {/* Next/Skip buttons - always visible when connected */}
          <div className="absolute inset-y-0 left-0 flex items-center z-10 pl-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
              onClick={handleFindNewPartner}
              title="Find Next Partner"
            >
              <ChevronLeft size={24} />
            </Button>
          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center z-10 pr-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
              onClick={handleFindNewPartner}
              title="Find Next Partner"
            >
              <ChevronRight size={24} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoDisplay;
