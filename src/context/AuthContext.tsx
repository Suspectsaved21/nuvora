
import React, { createContext, useState, useEffect } from "react";
import { nanoid } from "nanoid";

interface User {
  id: string;
  username: string;
  isGuest: boolean;
  provider?: string;
  subscription?: {
    status: "active" | "inactive";
    plan?: string;
    expiry?: number;
  };
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
  subscribeUser: () => Promise<void>;
  hasActiveSubscription: () => boolean;
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
  subscribeUser: async () => {},
  hasActiveSubscription: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem("nuvora-user");
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
      subscription: { status: "inactive" },
    };
    
    setUser(mockUser);
    localStorage.setItem("nuvora-user", JSON.stringify(mockUser));
  };

  const signUp = async (email: string, password: string) => {
    // This is a placeholder for Supabase authentication
    console.log("Sign up with:", email, password);
    
    // Mock user for now
    const mockUser = {
      id: nanoid(),
      username: email.split("@")[0],
      isGuest: false,
      subscription: { status: "inactive" },
    };
    
    setUser(mockUser);
    localStorage.setItem("nuvora-user", JSON.stringify(mockUser));
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
      subscription: { status: "inactive" },
    };
    
    setUser(mockUser);
    localStorage.setItem("nuvora-user", JSON.stringify(mockUser));
  };

  const continueAsGuest = () => {
    const guestUser = {
      id: nanoid(),
      username: `Guest_${Math.floor(Math.random() * 10000)}`,
      isGuest: true,
      subscription: { status: "inactive" },
    };
    
    setUser(guestUser);
    localStorage.setItem("nuvora-user", JSON.stringify(guestUser));
  };

  const updateUsername = async (newUsername: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      username: newUsername,
    };
    
    setUser(updatedUser);
    localStorage.setItem("nuvora-user", JSON.stringify(updatedUser));
  };

  const subscribeUser = async () => {
    if (!user) return;
    
    // In a real application, this would integrate with a payment processor
    // For now, we'll just update the user's subscription status directly
    const updatedUser = {
      ...user,
      subscription: {
        status: "active",
        plan: "premium",
        expiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      },
    };
    
    setUser(updatedUser);
    localStorage.setItem("nuvora-user", JSON.stringify(updatedUser));
  };

  const hasActiveSubscription = () => {
    if (!user || !user.subscription) return false;
    return user.subscription.status === "active";
  };

  const signOut = () => {
    localStorage.removeItem("nuvora-user");
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
        subscribeUser,
        hasActiveSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
