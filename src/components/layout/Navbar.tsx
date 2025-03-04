
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AuthContext from "@/context/AuthContext";
import { VideoIcon } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism px-6 py-4">
      <div className="container max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <VideoIcon className="h-6 w-6 text-purple-500" />
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            Nuvora
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <Link to="/privacy" className="text-sm hover:text-purple">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm hover:text-purple">
              Terms
            </Link>
          </div>
          
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/chat">
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  Start Chatting
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-sm"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/chat">
              <Button className="bg-purple hover:bg-purple-dark transition-colors">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
