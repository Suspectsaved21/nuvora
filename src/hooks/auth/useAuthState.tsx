
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "../useUserProfile";
import { setUserOnline } from "@/integrations/supabase/peerservice";

export function useAuthState() {
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

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    fetchUserProfile,
    updateUsername,
    subscribeUser,
    hasActiveSubscription
  };
}
