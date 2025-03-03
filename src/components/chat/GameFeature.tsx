
import { useContext } from "react";
import { Gamepad, Lock } from "lucide-react";
import ChatContext from "@/context/ChatContext";
import AuthContext from "@/context/AuthContext";
import { useGame } from "@/hooks/useGame";
import GameSetup from "./game/GameSetup";
import GameHeader from "./game/GameHeader";
import GameItem from "./game/GameItem";
import GameControls from "./game/GameControls";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const GameFeature = () => {
  const { partner, isConnected } = useContext(ChatContext);
  const { hasActiveSubscription, subscribeUser } = useContext(AuthContext);
  const {
    gameType,
    setGameType,
    category,
    setCategory,
    isPlaying,
    currentItem,
    timeLeft,
    showAnswer,
    userPoints,
    startGame,
    nextItem,
    revealAnswer,
    rateItem,
    endGame
  } = useGame();
  
  const handleSubscribe = async () => {
    try {
      // In a real app, this would redirect to a payment page
      await subscribeUser();
      toast({
        description: "Subscription successful! You now have access to the Game Center.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to process subscription. Please try again.",
      });
    }
  };
  
  // Check if the user has an active subscription
  const isPremiumUser = hasActiveSubscription();
  
  return (
    <div className="bg-secondary/50 dark:bg-secondary/30 rounded-lg border border-border p-4">
      <h3 className="font-semibold flex items-center mb-4">
        <Gamepad size={18} className="mr-2" />
        Game Center
      </h3>
      
      {!isPremiumUser ? (
        <div className="text-center py-8 space-y-4">
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-medium">Premium Feature</h4>
          <p className="text-muted-foreground mb-4">
            Unlock the Game Center with a Nuvora Premium subscription for just €1.99/month.
          </p>
          <Button 
            onClick={handleSubscribe}
            className="w-full max-w-xs bg-purple hover:bg-purple-dark"
          >
            Subscribe Now
          </Button>
        </div>
      ) : !isPlaying ? (
        <GameSetup 
          gameType={gameType}
          setGameType={setGameType}
          category={category}
          setCategory={setCategory}
          onStartGame={startGame}
          isConnected={isConnected}
          partnerName={partner?.username}
        />
      ) : (
        <div className="space-y-4">
          <GameHeader userPoints={userPoints} timeLeft={timeLeft} />
          
          <GameItem 
            item={currentItem}
            showAnswer={showAnswer}
            gameType={gameType}
            onReveal={revealAnswer}
          />
          
          <GameControls 
            onReveal={revealAnswer}
            onNext={nextItem}
            onRate={rateItem}
            onEndGame={endGame}
            showAnswer={showAnswer}
            gameType={gameType}
          />
        </div>
      )}
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          {isPremiumUser 
            ? "Play games with your chat partner to earn points and have fun! You'll both see the same riddles and questions."
            : "Subscribe to our premium plan to access exclusive games and features with your chat partners."}
        </p>
      </div>
    </div>
  );
};

export default GameFeature;
