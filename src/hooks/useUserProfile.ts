
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { toast } from "@/components/ui/use-toast";

export function useUserProfile() {
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
