
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import VideoChat from "@/components/chat/VideoChat";
import TextChat from "@/components/chat/TextChat";
import ChatControls from "@/components/chat/ChatControls";
import FriendsList from "@/components/chat/FriendsList";
import LocationSettings from "@/components/chat/LocationSettings";
import GameFeature from "@/components/chat/GameFeature";
import AuthForm from "@/components/auth/AuthForm";
import AuthContext from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Chat = () => {
  const { user, isLoading } = useContext(AuthContext);
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isChatVisible, setIsChatVisible] = useState(!isMobile);
  const [showGame, setShowGame] = useState(false);
  
  useEffect(() => {
    // Check if location state contains showGame property
    if (location.state && location.state.showGame) {
      setShowGame(true);
    }
  }, [location]);
  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Chrome requires returnValue to be set
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isMobile && <Navbar />}
      
      <main className={`flex-grow ${isMobile ? "pt-0" : "pt-24"} pb-12 px-4 sm:px-6`}>
        <div className="container max-w-7xl mx-auto">
          {user ? (
            <ChatProvider>
              <div className={cn(
                "grid grid-cols-1 gap-6",
                isMobile ? "" : "lg:grid-cols-3"
              )}>
                <div className={cn(
                  isMobile ? "col-span-1" : "lg:col-span-2",
                  "space-y-6"
                )}>
                  <VideoChat />
                  
                  {(!isMobile || !isChatVisible) && (
                    <>
                      {showGame ? (
                        <GameFeature />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <ChatControls />
                          <LocationSettings />
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {(!isMobile || isChatVisible) && (
                  <div className="h-[600px]">
                    <Tabs defaultValue="chat" className="h-full">
                      <TabsList className="w-full">
                        <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                        <TabsTrigger value="friends" className="flex-1">Friends</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="chat" className="h-[550px] mt-4">
                        <TextChat />
                      </TabsContent>
                      
                      <TabsContent value="friends" className="h-[550px] mt-4">
                        <FriendsList />
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </ChatProvider>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Sign In to Nuvora</h1>
                <p className="text-muted-foreground">
                  Create an account or continue as a guest to start chatting.
                </p>
              </div>
              
              <AuthForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
