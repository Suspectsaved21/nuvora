
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UsernameSettings from "@/components/profile/UsernameSettings";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AuthContext from "@/context/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, hasActiveSubscription } = useContext(AuthContext);

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
            <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-background/50 p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{user.username || 'Anonymous User'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="font-medium">{hasActiveSubscription() ? 'Premium' : 'Free'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="font-medium">{user.isGuest ? "Guest" : user.provider ? `${user.provider} Account` : "Regular Account"}</p>
                </div>
              </div>
            </div>
            
            <UsernameSettings />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
