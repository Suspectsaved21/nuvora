
import { useState, useContext, useEffect } from "react";
import { Gamepad } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ChatContext from "@/context/ChatContext";
import { GameType } from "@/types/game";
import { SAMPLE_RIDDLES, SAMPLE_QUESTIONS } from "@/data/gameData";
import GameSetup from "./game/GameSetup";
import GameHeader from "./game/GameHeader";
import GameItem from "./game/GameItem";
import GameControls from "./game/GameControls";

const GameFeature = () => {
  const { partner, isConnected, sendGameAction } = useContext(ChatContext);
  const [gameType, setGameType] = useState<GameType>("riddles");
  const [category, setCategory] = useState<string>("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  
  // Handle starting a new game
  const startGame = () => {
    const items = gameType === "riddles" ? SAMPLE_RIDDLES : SAMPLE_QUESTIONS;
    const filteredItems = category === "all" 
      ? items 
      : items.filter(item => item.category === category);
    
    if (filteredItems.length === 0) {
      toast({
        description: "No items available for this category. Try another one.",
      });
      return;
    }
    
    const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
    setCurrentItem(randomItem);
    setTimeLeft(30);
    setShowAnswer(false);
    setIsPlaying(true);
    
    // Notify the other user about game start
    if (partner) {
      sendGameAction({
        action: "start",
        gameType,
        category,
        itemId: randomItem.id
      });
    }
  };
  
  // Handle skipping to the next item
  const nextItem = () => {
    const items = gameType === "riddles" ? SAMPLE_RIDDLES : SAMPLE_QUESTIONS;
    const filteredItems = category === "all" 
      ? items 
      : items.filter(item => item.category === category);
    
    const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
    setCurrentItem(randomItem);
    setTimeLeft(30);
    setShowAnswer(false);
    
    // Notify the other user about next item
    if (partner) {
      sendGameAction({
        action: "next",
        gameType,
        category,
        itemId: randomItem.id
      });
    }
  };
  
  // Handle revealing the answer
  const revealAnswer = () => {
    setShowAnswer(true);
    
    // Notify the other user about revealed answer
    if (partner) {
      sendGameAction({
        action: "reveal",
        gameType,
        itemId: currentItem.id
      });
    }
  };
  
  // Handle rating the item
  const rateItem = (liked: boolean) => {
    // Add points if liked
    if (liked) {
      setUserPoints(prev => prev + 5);
    }
    
    // Notify the other user about the rating
    if (partner) {
      sendGameAction({
        action: "rate",
        gameType,
        itemId: currentItem.id,
        liked
      });
    }
    
    toast({
      description: liked 
        ? "You liked this item! +5 points" 
        : "You disliked this item. Let's try another one!",
    });
    
    // Move to next item
    nextItem();
  };
  
  // Timer effect
  useEffect(() => {
    let timerId: number | undefined;
    
    if (isPlaying && timeLeft > 0) {
      timerId = window.setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // Auto-reveal answer when time is up for riddles
            if (gameType === "riddles" && !showAnswer) {
              revealAnswer();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isPlaying, timeLeft, gameType, showAnswer]);
  
  return (
    <div className="bg-secondary/50 dark:bg-secondary/30 rounded-lg border border-border p-4">
      <h3 className="font-semibold flex items-center mb-4">
        <Gamepad size={18} className="mr-2" />
        Game Center
      </h3>
      
      {!isPlaying ? (
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
            onEndGame={() => setIsPlaying(false)}
            showAnswer={showAnswer}
            gameType={gameType}
          />
        </div>
      )}
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          Play games with your chat partner to earn points and have fun!
          You'll both see the same riddles and questions.
        </p>
      </div>
    </div>
  );
};

export default GameFeature;
