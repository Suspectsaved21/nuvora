
import React, { createContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthContextType } from "@/types/auth";

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
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
