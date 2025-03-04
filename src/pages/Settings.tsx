
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AuthContext from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useStripe } from "@/context/StripeContext";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { ChatProvider } from "@/context/chat";
import LocationSettings from "@/components/chat/LocationSettings";

const Settings = () => {
  const { user, signOut, hasActiveSubscription } = useContext(AuthContext);
  const { setShowSubscriptionModal } = useStripe();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 px-4 sm:px-6">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-8 flex items-center">
            <Link to="/chat">
              <Button variant="ghost" className="p-0 mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-background/50 p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-6">Account Settings</h2>
              
              <div className="flex justify-between items-center py-4 border-b">
                <div>
                  <h3 className="font-medium">Premium Account</h3>
                  <p className="text-sm text-muted-foreground">
                    {hasActiveSubscription() 
                      ? "You have a premium account" 
                      : "Upgrade to premium for €1.99/month"}
                  </p>
                </div>
                <Button 
                  onClick={() => setShowSubscriptionModal(true)}
                  variant={hasActiveSubscription() ? "outline" : "default"}
                >
                  {hasActiveSubscription() ? "Manage Subscription" : "Upgrade"}
                </Button>
              </div>
              
              <ChatProvider>
                <LocationSettings />
              </ChatProvider>
              
              <div className="pt-6">
                <Button 
                  variant="destructive" 
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
