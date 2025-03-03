
import React, { createContext, useState, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthContext from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

interface StripeContextType {
  isLoading: boolean;
  isProcessing: boolean;
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
  handleSubscribe: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

const StripeContext = createContext<StripeContextType>({
  isLoading: false,
  isProcessing: false,
  showSubscriptionModal: false,
  setShowSubscriptionModal: () => {},
  handleSubscribe: async () => {},
  cancelSubscription: async () => {},
});

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { user, subscribeUser } = useContext(AuthContext);

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "You must be logged in to subscribe.",
      });
      return;
    }

    if (user.isGuest) {
      toast({
        variant: "destructive",
        description: "Guest users cannot subscribe. Please create an account.",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // In a real implementation with Stripe, you would:
      // 1. Call a Supabase Edge Function to create a Stripe checkout session
      // 2. Redirect the user to the Stripe checkout page
      // 3. Handle webhook from Stripe to update subscription status
      
      // For now, we'll just use our mock subscription function
      await subscribeUser();
      
      // Close the modal
      setShowSubscriptionModal(false);
      
      toast({
        description: "Subscription successful! You now have access to the Game Center.",
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        variant: "destructive",
        description: "Failed to process subscription. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user || user.isGuest) return;
    
    try {
      setIsProcessing(true);
      
      // In a real implementation, this would call a Supabase Edge Function to cancel the Stripe subscription
      // For now, we'll just update the subscription status in the database
      
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled' as const,
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        description: "Your subscription has been canceled.",
      });
    } catch (error) {
      console.error("Cancel subscription error:", error);
      toast({
        variant: "destructive",
        description: "Failed to cancel subscription. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <StripeContext.Provider
      value={{
        isLoading,
        isProcessing,
        showSubscriptionModal,
        setShowSubscriptionModal,
        handleSubscribe,
        cancelSubscription,
      }}
    >
      {children}
    </StripeContext.Provider>
  );
};

export const useStripe = () => useContext(StripeContext);

export default StripeContext;
