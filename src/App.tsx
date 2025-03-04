import { Suspense, lazy, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { StripeProvider } from "@/context/StripeContext";
import SubscriptionModal from "@/components/subscription/SubscriptionModal";
import { createPeerConnection, connectToPeer } from "@/utils/peer";
import { supabase } from "@/supabaseClient";

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

  useEffect(() => {
    const newPeer = createPeerConnection();
    setPeer(newPeer);

    newPeer.on("open", async (id) => {
      console.log("Peer ID:", id);
      setPeerId(id);

      // Add User to Waiting List in Supabase
      await supabase
        .from("waiting_users")
        .insert([{ peer_id: id, is_available: true }]);
    });

    newPeer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            const video = document.createElement("video");
            video.srcObject = remoteStream;
            video.autoplay = true;
            video.className = "rounded-lg shadow-lg w-full h-auto";
            document.body.appendChild(video);
          });
        });
    });
  }, []);

  const findMatch = async () => {
    const { data: users } = await supabase
      .from("waiting_users")
      .select("peer_id")
      .neq("peer_id", peerId)
      .limit(1);

    if (users && users.length > 0) {
      const matchedPeerId = users[0].peer_id;
      console.log("Match found with:", matchedPeerId);
      connectToPeer(peer!, matchedPeerId);
      setMatchFound(true);

      // Remove User from Waiting List
      await supabase
        .from("waiting_users")
        .delete()
        .match({ peer_id: peerId });
    } else {
      console.log("No match found, waiting...");
    }
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
                    <div className="text-center">
                      <h1 className="text-3xl font-bold">Nexaconnect Video Chat</h1>
                      <button
                        onClick={findMatch}
                        className="bg-purple text-white px-4 py-2 rounded-lg mt-4">
                        {matchFound ? "Connected ✅" : "Find Match 🔍"}
                      </button>
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