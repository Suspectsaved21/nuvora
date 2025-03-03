
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
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

const Chat = () => {
  const { user, isLoading } = useContext(AuthContext);
  
  // Handle page reload to reinitialize video
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
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          {user ? (
            <ChatProvider>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <VideoChat />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChatControls />
                    <LocationSettings />
                  </div>
                  <GameFeature />
                </div>
                
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
              </div>
            </ChatProvider>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Sign In to Nexaconnect</h1>
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
