
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Log additional information that might help with debugging
    console.info("Current URL:", window.location.href);
    console.info("Browser user agent:", navigator.userAgent);
    console.info("Pathname:", location.pathname);
    console.info("Search params:", location.search);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-card rounded-lg shadow-md max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-primary">404</h1>
          <p className="text-xl text-foreground mb-4">Oops! Page not found</p>
          <p className="text-muted-foreground mb-6">The page you are looking for might have been removed or is temporarily unavailable.</p>
          <div className="space-x-4">
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
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
