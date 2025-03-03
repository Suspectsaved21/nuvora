
import React from "react";
import { useStripe } from "@/context/StripeContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";

const SubscriptionModal = () => {
  const { showSubscriptionModal, setShowSubscriptionModal, handleSubscribe, isProcessing } = useStripe();

  return (
    <Dialog open={showSubscriptionModal} onOpenChange={setShowSubscriptionModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuvora Premium Subscription</DialogTitle>
          <DialogDescription>
            Unlock premium features with Nuvora Premium
          </DialogDescription>
        </DialogHeader>

        <Card className="border-2 border-purple">
          <CardHeader className="bg-purple/10">
            <CardTitle className="text-center flex flex-col items-center">
              <span className="text-xl">Premium Plan</span>
              <span className="text-2xl font-bold">€1.99/month</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                <span>Access to Game Center</span>
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                <span>Play games with chat partners</span>
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                <span>Full access to all game categories</span>
              </li>
              <li className="flex items-start">
                <Check className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                <span>Cancel anytime</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubscribe} 
              disabled={isProcessing}
              className="w-full bg-purple hover:bg-purple-dark"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscribe Now
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground mb-2 sm:mb-0">
            Secure payment processing with Stripe
          </p>
          <Button variant="outline" onClick={() => setShowSubscriptionModal(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
