
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import AuthContext from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import VideoComponent from "@/components/chat/VideoChat";

const VideoChat = () => {
  const { user } = useContext(AuthContext);
  const isMobile = useIsMobile();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // Add dark theme to body for better video chat experience
  useEffect(() => {
    document.body.classList.add('bg-gradient-to-br', 'from-gray-900', 'to-black');
    
    return () => {
      document.body.classList.remove('bg-gradient-to-br', 'from-gray-900', 'to-black');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {!isMobile && <Navbar />}
      
      <main className={`flex-grow ${isMobile ? "p-0" : "py-10 px-4 sm:px-6"} overflow-hidden`}>
        <div className={`container max-w-7xl mx-auto ${isMobile ? "" : "pt-10"}`}>
          {!isMobile && (
            <div className="mb-6 flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Nuvora Video Chat</h1>
            </div>
          )}
          
          <ChatProvider>
            <VideoComponent />
          </ChatProvider>
        </div>
      </main>
    </div>
  );
};

export default VideoChat;
