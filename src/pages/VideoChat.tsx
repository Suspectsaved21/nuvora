
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AuthContext from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { ChatProvider } from "@/context/ChatContext";
import VideoComponent from "@/components/chat/VideoChat";

const VideoChat = () => {
  const { user } = useContext(AuthContext);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="mb-6 flex items-center">
            <Link to="/">
              <Button variant="ghost" className="p-0 mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Video Chat</h1>
          </div>
          
          <ChatProvider>
            <VideoComponent />
          </ChatProvider>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VideoChat;
