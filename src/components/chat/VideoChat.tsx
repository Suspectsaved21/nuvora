import { useRef, useEffect, useContext, useState } from "react";
import { initPeer, setupVideoCall, handleRemoteStream, cleanupMedia } from "@/lib/peerjs";
import ChatContext from "@/context/ChatContext";
import { VideoOff, Video, UserPlus, Mic, MicOff, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

const VideoChat = () => {
  const { partner, isConnected, addFriend } = useContext(ChatContext);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [peerInstance, setPeerInstance] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocalFullscreen, setIsLocalFullscreen] = useState(false);
  const videoChatRef = useRef<HTMLDivElement>(null);
  const localVideoChatRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  
  useEffect(() => {
    if (isMobile && videoChatRef.current) {
      requestFullscreen(videoChatRef.current);
    }
  }, [isMobile]);
  
  useEffect(() => {
    if (!isConnected || !partner) return;
    
    const userId = `user_${Math.random().toString(36).substring(2, 9)}`;
    const peer = initPeer(userId);
    setPeerInstance(peer);
    
    const initCall = async () => {
      try {
        const { localStream } = await setupVideoCall(localVideoRef, remoteVideoRef);
        
        peer.onIncomingCall((call) => {
          peer.answerCall(call, localStream);
          
          call.on('stream', (remoteStream: MediaStream) => {
            handleRemoteStream(remoteVideoRef, remoteStream);
          });
          
          call.on('close', () => {
            console.log('Call closed');
          });
        });
        
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
  
  const requestFullscreen = (element: HTMLElement) => {
    if (element.requestFullscreen) {
      element.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error("Fullscreen error:", err));
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
      setIsFullscreen(true);
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error("Exit fullscreen error:", err));
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
      setIsFullscreen(false);
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  const toggleFullscreen = () => {
    if (!videoChatRef.current) return;
    
    if (!isFullscreen) {
      requestFullscreen(videoChatRef.current);
    } else {
      exitFullscreen();
    }
  };

  const toggleLocalFullscreen = () => {
    if (!localVideoChatRef.current) return;
    
    if (!isLocalFullscreen) {
      requestFullscreen(localVideoChatRef.current);
    } else {
      exitFullscreen();
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement && document.fullscreenElement === videoChatRef.current);
      setIsLocalFullscreen(!!document.fullscreenElement && document.fullscreenElement === localVideoChatRef.current);
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
        isFullscreen || isMobile ? "fixed inset-0 z-50 h-screen aspect-auto" : ""
      )}
    >
      {!isConnected ? (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Waiting for connection...
        </div>
      ) : (
        <>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            onClick={toggleFullscreen}
          />
          
          <div 
            ref={localVideoChatRef}
            className={cn(
              "absolute bottom-4 right-4 w-1/4 aspect-video rounded-lg overflow-hidden shadow-lg border border-white/10",
              isLocalFullscreen ? "fixed inset-0 z-50 w-full h-screen aspect-auto" : "",
              isMobile ? "w-1/3" : "w-1/4"
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
