
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { StripeProvider } from "@/context/StripeContext";
import SubscriptionModal from "@/components/subscription/SubscriptionModal";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import ProfileSettings from "./pages/ProfileSettings";

const queryClient = new QueryClient();

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
          <Toaster />
          <Sonner />
          <SubscriptionModal />
          <BrowserRouter basename={getBasename()}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/profile/settings" element={<ProfileSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </StripeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
