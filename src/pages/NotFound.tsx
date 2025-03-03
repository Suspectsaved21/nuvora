
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

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
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-red-500">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">The page you are looking for might have been removed or is temporarily unavailable.</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
