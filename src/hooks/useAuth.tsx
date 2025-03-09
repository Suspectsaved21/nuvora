
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useUserProfile } from "./useUserProfile";
import { setUserOnline } from "@/integrations/supabase/peerservice";

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
        // Set user as online
        if (user) {
          setUserOnline(user, true);
        }
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state changed:", event);
          if (session?.user) {
            await fetchUserProfile(session.user);
            if (event === 'SIGNED_IN') {
              setUserOnline(user, true);
            }
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
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        await fetchUserProfile(data.user);
        
        // Update online status immediately upon login
        if (user) {
          await setUserOnline(user, true);
        }
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // First check if the user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', email.split("@")[0])
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (existingUsers && existingUsers.length > 0) {
        throw new Error("Username already exists. Please use a different email address.");
      }
      
      // Proceed with sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: email.split("@")[0],
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      
      // For immediate access: Create a temporary user profile
      if (data.user) {
        // Create a user profile object similar to what fetchUserProfile would return
        const tempUserProfile = {
          id: data.user.id,
          username: email.split("@")[0],
          isGuest: false,
          provider: 'email',
          subscription: { status: "inactive" as "inactive" }
        };
        
        setUser(tempUserProfile);
        
        // Set user as online
        await setUserOnline(tempUserProfile, true);
        
        toast({
          description: "Account created successfully! You can now use the application.",
        });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        variant: "destructive",
        description: error.message || "Failed to sign up. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithSocial = async (provider: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: window.location.origin,
        }
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
    try {
      setIsLoading(true);
      
      if (user?.isGuest) {
        // For guest users, just clear local storage
        localStorage.removeItem("nuvora-guest-user");
        setUser(null);
        return;
      }
      
      // For registered users, update online status to false before signing out
      if (user && !user.isGuest) {
        await setUserOnline(user, false);
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      setUser(null);
    } catch (error) {
      console.error("Error during sign out:", error);
      toast({
        variant: "destructive",
        description: "Failed to sign out properly. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
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
