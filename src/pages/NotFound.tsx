
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Log detailed information about the 404 error
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Log additional information that might help with debugging
    console.info("Current URL:", window.location.href);
    console.info("Browser user agent:", navigator.userAgent);
    console.info("Pathname:", location.pathname);
    console.info("Search params:", location.search);
    console.info("Origin:", window.location.origin);
    console.info("Host:", window.location.host);
    
    // Show toast notification
    toast({
      title: "Page not found",
      description: `The requested page "${location.pathname}" does not exist.`,
      variant: "destructive",
    });
  }, [location.pathname, toast]);

  const handleRetryNavigation = () => {
    // Force page reload to trigger server-side routing
    window.location.href = window.location.origin + location.pathname;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-background p-4">
        <div className="text-center p-8 bg-card rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
          <p className="text-xl text-foreground mb-4">Oops! Page not found</p>
          <p className="text-muted-foreground mb-6">
            The page "{location.pathname}" you are looking for might have been removed or is temporarily unavailable.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
            <Link 
              to="/" 
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Return to Home
            </Link>
            <Link 
              to="/chat" 
              className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors"
            >
              Go to Chat
            </Link>
            <button
              onClick={handleRetryNavigation}
              className="inline-block px-6 py-3 bg-muted text-muted-foreground rounded hover:bg-muted/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
