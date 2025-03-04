
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { StripeProvider } from "@/context/StripeContext";
import SubscriptionModal from "@/components/subscription/SubscriptionModal";

// Import pages with error boundaries
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load less critical pages to improve initial load time
const Chat = lazy(() => import("./pages/Chat"));
const Profile = lazy(() => import("./pages/Profile"));
const Games = lazy(() => import("./pages/Games"));
const Friends = lazy(() => import("./pages/Friends"));
const Settings = lazy(() => import("./pages/Settings"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));

// Create a loading fallback for lazy-loaded components
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
  </div>
);

// Configure React Query for optimal performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
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
          <Toaster />
          <Sonner />
          <SubscriptionModal />
          <BrowserRouter basename={getBasename()}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Chat />
                </Suspense>
              } />
              <Route path="/profile" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Profile />
                </Suspense>
              } />
              <Route path="/games" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Games />
                </Suspense>
              } />
              <Route path="/friends" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Friends />
                </Suspense>
              } />
              <Route path="/settings" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Settings />
                </Suspense>
              } />
              <Route path="/privacy" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Privacy />
                </Suspense>
              } />
              <Route path="/terms" element={
                <Suspense fallback={<LoadingFallback />}>
                  <Terms />
                </Suspense>
              } />
              <Route path="/profile/settings" element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProfileSettings />
                </Suspense>
              } />
              
              {/* Handle 404s by redirecting to NotFound component */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </BrowserRouter>
        </StripeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
