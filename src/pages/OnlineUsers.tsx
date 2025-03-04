
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AuthContext from "@/context/AuthContext";
import { Link } from "react-router-dom";
import OnlineUsersList from "@/components/users/OnlineUsersList";

const OnlineUsers = () => {
  const { user } = useContext(AuthContext);

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
            <h1 className="text-2xl sm:text-3xl font-bold">Online Users</h1>
          </div>
          
          <div className="bg-background/50 p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Browse users who are currently online and add them as friends.
              </p>
            </div>
            
            <OnlineUsersList />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OnlineUsers;
