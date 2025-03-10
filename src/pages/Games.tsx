
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AuthContext from "@/context/AuthContext";
import { Link } from "react-router-dom";
import GameFeature from "@/components/chat/GameFeature";
import { useStripe } from "@/context/StripeContext";
import { ChatProvider } from "@/context/ChatContext";

const Games = () => {
  const { user, hasActiveSubscription } = useContext(AuthContext);
  const { setShowSubscriptionModal } = useStripe();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // If not premium, show subscription modal
  if (!hasActiveSubscription()) {
    setShowSubscriptionModal(true);
    return <Navigate to="/chat" />;
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
            <h1 className="text-2xl sm:text-3xl font-bold">Games</h1>
          </div>
          
          <ChatProvider>
            <GameFeature />
          </ChatProvider>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Games;
