import Index from "@/pages/Index";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import ProfileSettings from "@/pages/ProfileSettings";
import Settings from "@/pages/Settings";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Friends from "@/pages/Friends";
import Games from "@/pages/Games";
import NotFound from "@/pages/NotFound";
import OnlineUsers from "@/pages/OnlineUsers";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { StripeProvider } from "@/context/StripeContext";

function App() {
  return (
    <AuthProvider>
      <StripeProvider>
        <ThemeProvider defaultTheme="dark" storageKey="nuvora-theme">
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/settings" element={<ProfileSettings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/games" element={<Games />} />
              <Route path="/online-users" element={<OnlineUsers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </StripeProvider>
    </AuthProvider>
  );
}

export default App;
