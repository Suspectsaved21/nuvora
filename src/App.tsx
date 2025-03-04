
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { StripeProvider } from "@/context/StripeContext";
import { ChatProvider } from "@/context/ChatContext";
import SubscriptionModal from "@/components/subscription/SubscriptionModal";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import Friends from "./pages/Friends";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import ProfileSettings from "./pages/ProfileSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Get basename from environment if available
const getBasename = () => {
  // Use this for custom domain
  return '/';
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StripeProvider>
          <ChatProvider>
            <Toaster />
            <Sonner />
            <SubscriptionModal />
            <BrowserRouter basename={getBasename()}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/games" element={<Games />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/profile/settings" element={<ProfileSettings />} />
                
                {/* Handle 404s by redirecting to NotFound component */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </StripeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
