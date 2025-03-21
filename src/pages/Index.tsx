
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Video, MessageSquare, Globe, Shield, MoveRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthContext from "@/context/AuthContext";

const Index = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="container max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <div className="inline-block glass-morphism rounded-full px-4 py-1 text-sm text-purple font-medium">
                  Connect Anonymously. Chat Globally.
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Meet new people from <span className="text-purple">around the world</span>
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-xl">
                  Connect with strangers through video and text chat in a safe, anonymous environment. Find new friends, practice languages, or just have casual conversations.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/chat">
                    <Button className="bg-purple hover:bg-purple-dark text-white px-8 py-6 text-lg">
                      Start Chatting
                      <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="lg:flex justify-end hidden">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-radial from-purple/20 to-transparent rounded-full filter blur-xl"></div>
                  <img
                    src="https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=1470&auto=format&fit=crop"
                    alt="People connecting"
                    className="w-full max-w-lg rounded-2xl shadow-xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-6 bg-secondary/50 dark:bg-secondary/20">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">How Nuvora Works</h2>
              <p className="text-muted-foreground">
                Our platform makes it simple to connect with new people worldwide through high-quality video and text chat.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background glass-morphism p-6 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-purple/10 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Video Chat</h3>
                <p className="text-muted-foreground">
                  Connect face-to-face with people around the world using our high-quality video chat.
                </p>
              </div>
              
              <div className="bg-background glass-morphism p-6 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-purple/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Text Chat</h3>
                <p className="text-muted-foreground">
                  Exchange messages in real-time with intuitive typing indicators and read receipts.
                </p>
              </div>
              
              <div className="bg-background glass-morphism p-6 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-purple/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Matching</h3>
                <p className="text-muted-foreground">
                  Our algorithm matches you with people from around the world, with optional country and language filters.
                </p>
              </div>
              
              <div className="bg-background glass-morphism p-6 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-purple/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safety First</h3>
                <p className="text-muted-foreground">
                  Our AI moderation system ensures a safe environment by filtering inappropriate content.
                </p>
              </div>
              
              <div className="bg-background glass-morphism p-6 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-purple/10 flex items-center justify-center mb-4">
                  <MoveRight className="h-6 w-6 text-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Skip Anytime</h3>
                <p className="text-muted-foreground">
                  Not feeling the conversation? Simply skip to the next person with one click.
                </p>
              </div>
              
              <div className="bg-background glass-morphism p-6 rounded-xl">
                <div className="h-12 w-12 rounded-full bg-purple/10 flex items-center justify-center mb-4">
                  <ArrowRight className="h-6 w-6 text-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
                <p className="text-muted-foreground">
                  Our intuitive interface makes it simple to connect with new people in seconds.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="container max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-purple/10 to-purple/20 dark:from-purple/20 dark:to-purple/5 rounded-2xl p-8 md:p-12 glass-morphism text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to start chatting?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of users already connecting on Nuvora. Start chatting now - no downloads required.
              </p>
              <Link to="/chat">
                <Button className="bg-purple hover:bg-purple-dark text-white px-8 py-6 text-lg">
                  Get Started
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
