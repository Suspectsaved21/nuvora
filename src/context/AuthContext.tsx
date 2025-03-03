
import React, { createContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

interface UserProfile {
  id: string;
  username: string;
  isGuest: boolean;
  provider?: string;
  subscription?: {
    status: "active" | "inactive" | "canceled";
    plan?: string;
    expiry?: number;
  };
}

interface AuthContextType {
  user: UserProfile | null;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data from Supabase
  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, subscriptions(*)')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      if (data) {
        // Make sure we explicitly cast the subscription status to the allowed types
        const subscriptionStatus = data.subscriptions?.status as "active" | "inactive" | "canceled" || "inactive";
        
        const userProfile: UserProfile = {
          id: data.id,
          username: data.username,
          isGuest: data.is_guest,
          provider: authUser.app_metadata.provider,
          subscription: data.subscriptions ? {
            status: subscriptionStatus,
            plan: data.subscriptions.plan,
            expiry: data.subscriptions.end_date ? new Date(data.subscriptions.end_date).getTime() : undefined
          } : { status: "inactive" }
        };
        
        setUser(userProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Check for existing session on load
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            await fetchUserProfile(session.user);
          } else {
            setUser(null);
          }
        }
      );
      
      setIsLoading(false);
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        await fetchUserProfile(data.user);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: email.split("@")[0],
          },
        },
      });

      if (error) throw error;
      
      // The user profile will be created automatically via the database trigger
      if (data.user) {
        toast({
          description: "Verification email sent. Please check your inbox.",
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signInWithSocial = async (provider: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
      });

      if (error) throw error;
      
      // Redirect will happen automatically
    } catch (error: any) {
      console.error(`${provider} sign in error:`, error);
      toast({
        variant: "destructive",
        description: `Failed to sign in with ${provider}. Please try again.`,
      });
    }
  };

  const continueAsGuest = async () => {
    try {
      // Generate a random username for the guest
      const guestUsername = `Guest_${Math.floor(Math.random() * 10000)}`;
      
      // Store guest user in local storage
      const guestUser: UserProfile = {
        id: `guest_${Date.now()}`,
        username: guestUsername,
        isGuest: true,
        subscription: { status: "inactive" },
      };
      
      setUser(guestUser);
      localStorage.setItem("nuvora-guest-user", JSON.stringify(guestUser));
      
      toast({
        description: "You are now using Nuvora as a guest.",
      });
    } catch (error) {
      console.error("Guest access error:", error);
      toast({
        variant: "destructive",
        description: "Failed to continue as guest. Please try again.",
      });
    }
  };

  const updateUsername = async (newUsername: string) => {
    if (!user) return;
    
    try {
      if (user.isGuest) {
        // For guest users, just update local state
        const updatedUser = {
          ...user,
          username: newUsername,
        };
        
        setUser(updatedUser);
        localStorage.setItem("nuvora-guest-user", JSON.stringify(updatedUser));
        return;
      }
      
      // For registered users, update in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUser({
        ...user,
        username: newUsername,
      });
      
    } catch (error) {
      console.error("Update username error:", error);
      throw error;
    }
  };

  const subscribeUser = async () => {
    if (!user) return;
    
    try {
      if (user.isGuest) {
        toast({
          variant: "destructive",
          description: "Please create an account to subscribe.",
        });
        return;
      }
      
      // Calculate the end date (30 days from now)
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      // Update subscription in Supabase - convert Date to ISO string for PostgreSQL
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'active' as const,
          plan: 'premium',
          end_date: endDate.toISOString() // Convert Date to ISO string
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUser({
        ...user,
        subscription: {
          status: "active",
          plan: "premium",
          expiry: endDate.getTime(),
        },
      });
      
    } catch (error) {
      console.error("Subscribe user error:", error);
      throw error;
    }
  };

  const hasActiveSubscription = () => {
    if (!user || !user.subscription) return false;
    
    // Check if subscription is active and not expired
    return user.subscription.status === "active" && 
           (!user.subscription.expiry || user.subscription.expiry > Date.now());
  };

  const signOut = async () => {
    if (user?.isGuest) {
      // For guest users, just clear local storage
      localStorage.removeItem("nuvora-guest-user");
      setUser(null);
      return;
    }
    
    // For registered users, sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Sign out error:", error);
    }
    
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
