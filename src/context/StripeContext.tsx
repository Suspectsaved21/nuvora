
import React, { createContext, useState, useContext, useEffect } from "react";
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

    try {
      setIsProcessing(true);
      // In a real implementation, we would redirect to Stripe checkout
      // or show a Stripe payment element here
      
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
    // In a real app, this would call an API to cancel the subscription
    toast({
      description: "Your subscription has been canceled.",
    });
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
