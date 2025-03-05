
import { Suspense, lazy, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { StripeProvider } from "@/context/StripeContext";
import SubscriptionModal from "@/components/subscription/SubscriptionModal";
import { createPeerConnection, connectToPeer, registerAsWaiting, removeFromWaitingList, findMatch } from "@/utils/peer";
import { supabase } from "@/supabaseClient";
import { useWaitingUsers } from "@/hooks/useWaitingUsers";
import { toast } from "sonner";
import Peer from "peerjs";

// Import Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
const Chat = lazy(() => import("./pages/Chat"));
const Profile = lazy(() => import("./pages/Profile"));
const Games = lazy(() => import("./pages/Games"));
const Friends = lazy(() => import("./pages/Friends"));
const Settings = lazy(() => import("./pages/Settings"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));

// React Query Setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
  </div>
);

const App = () => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>("");
  const [matchFound, setMatchFound] = useState(false);
  const [searchingForMatch, setSearchingForMatch] = useState(false);
  const [currentCall, setCurrentCall] = useState<any>(null);
  
  // Get real-time waiting users
  const { waitingUsers } = useWaitingUsers(peerId);

  useEffect(() => {
    const initializePeer = async () => {
      try {
        const newPeer = createPeerConnection();
        setPeer(newPeer);

        newPeer.on("open", async (id) => {
          console.log("Peer connection established with ID:", id);
          setPeerId(id);
        });

        newPeer.on("call", (call) => {
          toast.info("Incoming video call");
          
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              // Create local video
              const localVideo = document.createElement("video");
              localVideo.srcObject = stream;
              localVideo.muted = true;
              localVideo.play();
              localVideo.className = "rounded-lg shadow-lg w-1/3 h-auto absolute bottom-20 right-4 z-10";
              document.body.appendChild(localVideo);
              
              // Answer the call
              call.answer(stream);
              
              // Handle the remote stream
              call.on("stream", (remoteStream) => {
                console.log("Received remote stream from incoming call");
                
                const video = document.createElement("video");
                video.srcObject = remoteStream;
                video.autoplay = true;
                video.className = "rounded-lg shadow-lg w-full h-auto";
                document.body.appendChild(video);
                
                setMatchFound(true);
                setSearchingForMatch(false);
                
                // Remove from waiting list if we were waiting
                if (peerId) {
                  removeFromWaitingList(peerId);
                }
                
                toast.success("Connected to video chat");
              });
              
              setCurrentCall(call);
            })
            .catch((err) => {
              console.error("Error accessing media devices:", err);
              toast.error(`Could not access camera or microphone: ${err.message}`);
            });
        });
      } catch (error) {
        console.error("Error initializing peer:", error);
        toast.error("Failed to initialize video chat");
      }
    };

    initializePeer();

    return () => {
      // Clean up when component unmounts
      if (peerId) {
        removeFromWaitingList(peerId);
      }
      
      if (currentCall) {
        currentCall.close();
      }
      
      if (peer) {
        peer.destroy();
      }
    };
  }, []);

  // Auto-connect to a match when new waiting users appear
  useEffect(() => {
    const autoConnect = async () => {
      if (searchingForMatch && waitingUsers.length > 0 && peer && peerId && !matchFound) {
        console.log("Auto-connecting to new waiting user:", waitingUsers[0].peer_id);
        
        try {
          const call = await connectToPeer(peer, waitingUsers[0].peer_id);
          setCurrentCall(call);
          setMatchFound(true);
          
          // Remove both users from waiting list
          await removeFromWaitingList(peerId);
          await removeFromWaitingList(waitingUsers[0].peer_id);
          
          setSearchingForMatch(false);
        } catch (error) {
          console.error("Auto-connect failed:", error);
        }
      }
    };
    
    autoConnect();
  }, [waitingUsers, searchingForMatch, peer, peerId, matchFound]);

  const findMatchHandler = async () => {
    if (!peer || !peerId) {
      toast.error("Video chat not initialized yet");
      return;
    }
    
    if (matchFound) {
      toast.info("You're already in a call");
      return;
    }
    
    setSearchingForMatch(true);
    toast.info("Looking for someone to chat with...");
    
    try {
      // Register as waiting
      await registerAsWaiting(peerId);
      
      // Try to find an immediate match
      const matchedPeerId = await findMatch(peerId);
      
      if (matchedPeerId) {
        console.log("Match found immediately with:", matchedPeerId);
        const call = await connectToPeer(peer, matchedPeerId);
        setCurrentCall(call);
        setMatchFound(true);
        
        // Remove both users from waiting list
        await removeFromWaitingList(peerId);
        await removeFromWaitingList(matchedPeerId);
        
        setSearchingForMatch(false);
      } else {
        console.log("No immediate match found, waiting for someone to connect...");
        // We'll wait for the real-time subscription to notify us of new users
      }
    } catch (error) {
      console.error("Error in match finding:", error);
      setSearchingForMatch(false);
      toast.error("Failed to find a match");
    }
  };

  const endCall = async () => {
    if (currentCall) {
      currentCall.close();
      setCurrentCall(null);
    }
    
    // Clean up videos
    document.querySelectorAll("video").forEach(v => v.remove());
    
    setMatchFound(false);
    toast.info("Call ended");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <StripeProvider>
            <Toaster />
            <Sonner />
            <SubscriptionModal />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/chat" element={
                  <Suspense fallback={<LoadingFallback />}>
                    <div className="text-center py-8">
                      <h1 className="text-3xl font-bold mb-4">Nexaconnect Video Chat</h1>
                      <p className="text-gray-600 mb-6">Connect with random people from around the world!</p>
                      
                      <div className="flex flex-col items-center gap-4">
                        {!matchFound ? (
                          <button
                            onClick={findMatchHandler}
                            disabled={!peerId || searchingForMatch}
                            className={`bg-purple text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all ${
                              !peerId || searchingForMatch ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-dark'
                            }`}>
                            {searchingForMatch ? (
                              <span className="flex items-center">
                                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                                Finding a Match...
                              </span>
                            ) : (
                              "Find Someone to Chat With 🔍"
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={endCall}
                            className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-600 transition-all">
                            End Call
                          </button>
                        )}
                        
                        {searchingForMatch && (
                          <p className="text-sm text-gray-500 animate-pulse">
                            {waitingUsers.length > 0 
                              ? `Found ${waitingUsers.length} people waiting, connecting...` 
                              : "Waiting for someone to join..."}
                          </p>
                        )}
                      </div>
                      
                      {/* Connection status */}
                      <div className="mt-8 text-left max-w-lg mx-auto">
                        <h2 className="text-lg font-semibold mb-2">Connection Status:</h2>
                        <ul className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-2 text-sm">
                          <li className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${peer ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            Peer Connection: {peer ? 'Initialized ✓' : 'Disconnected ✗'}
                          </li>
                          <li className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${peerId ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            Peer ID: {peerId ? `${peerId.substring(0, 8)}...` : 'Waiting...'}
                          </li>
                          <li className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${
                              matchFound ? 'bg-green-500' : searchingForMatch ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}></span>
                            Match Status: {
                              matchFound ? 'Connected ✓' : 
                              searchingForMatch ? 'Searching...' : 
                              'Not Searching'
                            }
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Suspense>
                } />
                <Route path="/profile" element={<Suspense fallback={<LoadingFallback />}><Profile /></Suspense>} />
                <Route path="/games" element={<Suspense fallback={<LoadingFallback />}><Games /></Suspense>} />
                <Route path="/friends" element={<Suspense fallback={<LoadingFallback />}><Friends /></Suspense>} />
                <Route path="/settings" element={<Suspense fallback={<LoadingFallback />}><Settings /></Suspense>} />
                <Route path="/privacy" element={<Suspense fallback={<LoadingFallback />}><Privacy /></Suspense>} />
                <Route path="/terms" element={<Suspense fallback={<LoadingFallback />}><Terms /></Suspense>} />
                <Route path="/profile/settings" element={<Suspense fallback={<LoadingFallback />}><ProfileSettings /></Suspense>} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </BrowserRouter>
          </StripeProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
