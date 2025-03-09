
import { useAuthState } from "./auth/useAuthState";
import { useAuthMethods } from "./auth/useAuthMethods";

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
  } = useAuthState();

  const {
    signIn,
    signUp,
    signInWithSocial,
    continueAsGuest,
    signOut
  } = useAuthMethods({
    user,
    setUser,
    setIsLoading,
    fetchUserProfile
  });

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
