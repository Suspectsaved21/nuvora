
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling and navigation logging
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  
  try {
    // Log initial navigation
    console.log("Initial navigation path:", window.location.pathname);
    
    // Handle potential SPA routing issues
    if (window.location.pathname !== '/' && !window.location.pathname.includes('.')) {
      console.log('Direct navigation to SPA route:', window.location.pathname);
    }
    
    root.render(<App />);
    console.log("Application successfully rendered");
  } catch (error) {
    console.error("Failed to render the application:", error);
  }
}
