
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  
  try {
    root.render(<App />);
    console.log("Application successfully rendered");
  } catch (error) {
    console.error("Failed to render the application:", error);
  }
}
