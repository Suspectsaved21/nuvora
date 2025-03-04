
import { useRef, useEffect, useContext, useState } from "react";
import { initPeer, setupVideoCall, handleRemoteStream, cleanupMedia } from "@/lib/peerjs";
import ChatContext from "@/context/ChatContext";
import { VideoOff, Video, UserPlus, Mic, MicOff, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const VideoChat = () => {
  const { partner, isConnected, addFriend } = useContext(ChatContext);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [peerInstance, setPeerInstance] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoChatRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isConnected || !partner) return;
    
    const userId = `user_${Math.random().toString(36).substring(2, 9)}`;
    const peer = initPeer(userId);
    setPeerInstance(peer);
    
    const initCall = async () => {
      try {
        const { localStream } = await setupVideoCall(localVideoRef, remoteVideoRef);
        
        // Set up to receive calls
        peer.onIncomingCall((call) => {
          peer.answerCall(call, localStream);
          
          call.on('stream', (remoteStream: MediaStream) => {
            handleRemoteStream(remoteVideoRef, remoteStream);
          });
          
          call.on('close', () => {
            console.log('Call closed');
          });
        });
        
        // If we have a partner, initiate the call
        if (partner && partner.id) {
          const partnerId = `partner_${partner.id}`;
          const call = peer.connect(partnerId);
          
          if (call) {
            call.on('stream', (remoteStream: MediaStream) => {
              handleRemoteStream(remoteVideoRef, remoteStream);
            });
          }
        }
      } catch (error) {
        console.error("Error setting up call:", error);
        toast({
          variant: "destructive",
          title: "Call Error",
          description: "Could not establish audio/video connection"
        });
      }
    };
    
    initCall();
    
    return () => {
      cleanupMedia();
      if (peerInstance) {
        peerInstance.destroy();
      }
    };
  }, [isConnected, partner]);
  
  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };
  
  const toggleAudio = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };
  
  const handleAddFriend = () => {
    if (partner) {
      addFriend(partner.id);
      toast({
        title: "Friend Added",
        description: `${partner.username} was added to your friends list.`,
      });
    }
  };
  
  const toggleFullscreen = () => {
    if (!videoChatRef.current) return;
    
    if (!isFullscreen) {
      // If we're entering fullscreen
      if (videoChatRef.current.requestFullscreen) {
        videoChatRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error("Fullscreen error:", err));
      } else if ((videoChatRef.current as any).webkitRequestFullscreen) {
        // Safari
        (videoChatRef.current as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if ((videoChatRef.current as any).msRequestFullscreen) {
        // IE11
        (videoChatRef.current as any).msRequestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      // If we're exiting fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error("Exit fullscreen error:", err));
      } else if ((document as any).webkitExitFullscreen) {
        // Safari
        (document as any).webkitExitFullscreen();
        setIsFullscreen(false);
      } else if ((document as any).msExitFullscreen) {
        // IE11
        (document as any).msExitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  
  return (
    <div 
      ref={videoChatRef}
      className={cn(
        "relative w-full aspect-video bg-nexablack rounded-lg overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50 h-screen aspect-auto" : ""
      )}
    >
      {!isConnected ? (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Waiting for connection...
        </div>
      ) : (
        <>
          {/* Remote video takes up the full container */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            onClick={toggleFullscreen}
          />
          
          {/* Local video is smaller and in the corner */}
          <div className="absolute bottom-4 right-4 w-1/4 aspect-video rounded-lg overflow-hidden shadow-lg border border-white/10">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Video/audio controls */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVideo}
              className="bg-black/50 border-white/20 text-white hover:bg-black/70"
            >
              {videoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleAudio}
              className="bg-black/50 border-white/20 text-white hover:bg-black/70"
            >
              {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddFriend}
              className="bg-black/50 border-white/20 text-white hover:bg-black/70"
              title="Add to Friends"
            >
              <UserPlus size={16} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              className="bg-black/50 border-white/20 text-white hover:bg-black/70"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
          </div>
          
          {/* Partner info */}
          {partner && (
            <div className="absolute top-4 left-4 glass-morphism px-3 py-1 rounded-full text-sm text-white">
              {partner.username} · {partner.country}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoChat;
