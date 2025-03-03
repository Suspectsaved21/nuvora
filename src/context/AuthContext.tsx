
import React, { createContext, useState, useEffect } from "react";
import { nanoid } from "nanoid";

interface User {
  id: string;
  username: string;
  isGuest: boolean;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithSocial: (provider: string) => void;
  continueAsGuest: () => void;
  signOut: () => void;
  updateUsername: (newUsername: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithSocial: () => {},
  continueAsGuest: () => {},
  signOut: () => {},
  updateUsername: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem("nexaconnect-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // This is a placeholder for Supabase authentication
    console.log("Sign in with:", email, password);
    
    // Mock user for now
    const mockUser = {
      id: nanoid(),
      username: email.split("@")[0],
      isGuest: false,
    };
    
    setUser(mockUser);
    localStorage.setItem("nexaconnect-user", JSON.stringify(mockUser));
  };

  const signUp = async (email: string, password: string) => {
    // This is a placeholder for Supabase authentication
    console.log("Sign up with:", email, password);
    
    // Mock user for now
    const mockUser = {
      id: nanoid(),
      username: email.split("@")[0],
      isGuest: false,
    };
    
    setUser(mockUser);
    localStorage.setItem("nexaconnect-user", JSON.stringify(mockUser));
  };

  const signInWithSocial = (provider: string) => {
    console.log(`Sign in with ${provider}`);
    
    // Mock social login for now
    const providers: {[key: string]: string} = {
      google: 'google.com',
      facebook: 'facebook.com',
      instagram: 'instagram.com'
    };
    
    const domain = providers[provider] || 'example.com';
    const mockUser = {
      id: nanoid(),
      username: `user_${Math.floor(Math.random() * 10000)}`,
      isGuest: false,
      provider,
    };
    
    setUser(mockUser);
    localStorage.setItem("nexaconnect-user", JSON.stringify(mockUser));
  };

  const continueAsGuest = () => {
    const guestUser = {
      id: nanoid(),
      username: `Guest_${Math.floor(Math.random() * 10000)}`,
      isGuest: true,
    };
    
    setUser(guestUser);
    localStorage.setItem("nexaconnect-user", JSON.stringify(guestUser));
  };

  const updateUsername = async (newUsername: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      username: newUsername,
    };
    
    setUser(updatedUser);
    localStorage.setItem("nexaconnect-user", JSON.stringify(updatedUser));
  };

  const signOut = () => {
    localStorage.removeItem("nexaconnect-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signInWithSocial,
        continueAsGuest,
        signOut,
        updateUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
