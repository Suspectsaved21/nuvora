
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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

  return (
    <div className="min-h-screen flex flex-col">
      {!isMobile && <Navbar />}
      
      <main className={`flex-grow ${isMobile ? "p-0" : "py-10 px-4 sm:px-6"} overflow-hidden`}>
        <div className={`container max-w-7xl mx-auto ${isMobile ? "" : "pt-10"}`}>
          {!isMobile && (
            <div className="mb-6 flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold">Video Chat</h1>
            </div>
          )}
          
          <ChatProvider>
            <VideoComponent />
          </ChatProvider>
        </div>
      </main>
      
      {!isMobile && <Footer />}
    </div>
  );
};

export default VideoChat;
