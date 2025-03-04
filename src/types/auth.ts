
export interface UserProfile {
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

export interface User {
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

export interface AuthContextType {
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
