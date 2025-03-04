
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
    hasActiveSubscription,
    updateOnlineStatus
  } = useUserProfile();

  // Check for existing session on load
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchUserProfile(session.user);
        // Set user as online when authenticated
        updateOnlineStatus(true);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            await fetchUserProfile(session.user);
            // Set user as online when authenticated
            updateOnlineStatus(true);
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

    // Set up beforeunload event to set user offline when closing browser
    const handleBeforeUnload = () => {
      if (user && !user.isGuest) {
        // Use a synchronous request to update status before page unloads
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/api/set-offline`, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ userId: user.id }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Set user as offline when component unmounts
      if (user && !user.isGuest) {
        updateOnlineStatus(false);
      }
    };
  }, [user]);

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
      
      // For immediate access: Create a temporary user profile
      if (data.user) {
        // Instead of waiting for email verification, give immediate access
        // Create a user profile object similar to what fetchUserProfile would return
        const tempUserProfile = {
          id: data.user.id,
          username: email.split("@")[0],
          isGuest: false,
          provider: 'email',
          subscription: { status: "inactive" as "inactive" }
        };
        
        setUser(tempUserProfile);
        
        toast({
          description: "Account created! You can now use the app.",
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
    if (user && !user.isGuest) {
      // Set user as offline before signing out
      await updateOnlineStatus(false);
    }
    
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
    hasActiveSubscription,
    updateOnlineStatus
  };
}
