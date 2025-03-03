
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useUserProfile } from "./useUserProfile";

export function useAuth() {
  const { 
    user, 
    setUser, 
    isLoading, 
    setIsLoading, 
    fetchUserProfile, 
    updateUsername, 
    subscribeUser,
    hasActiveSubscription 
  } = useUserProfile();

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
      const guestUser = {
        id: `guest_${Date.now()}`,
        username: guestUsername,
        isGuest: true,
        subscription: { status: "inactive" as const },
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

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signInWithSocial,
    continueAsGuest,
    signOut,
    updateUsername,
    subscribeUser,
    hasActiveSubscription
  };
}
