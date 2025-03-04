
import { useState, useEffect, useContext } from "react";
import { toast } from "@/components/ui/use-toast";
import { ChatContext } from "@/context/chat";
import { GameType, GameItem } from "@/types/game";
import { SAMPLE_RIDDLES, SAMPLE_QUESTIONS } from "@/data/gameData";

export function useGame() {
  const { partner, sendGameAction } = useContext(ChatContext);
  const [gameType, setGameType] = useState<GameType>("riddles");
  const [category, setCategory] = useState<string>("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentItem, setCurrentItem] = useState<GameItem | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userPoints, setUserPoints] = useState(0);

  // Get filtered items based on current game type and category
  const getFilteredItems = () => {
    const items = gameType === "riddles" ? SAMPLE_RIDDLES : SAMPLE_QUESTIONS;
    return category === "all" 
      ? items 
      : items.filter(item => item.category === category);
  };

  // Handle starting a new game
  const startGame = () => {
    const filteredItems = getFilteredItems();
    
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
    const filteredItems = getFilteredItems();
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
        itemId: currentItem?.id
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
        itemId: currentItem?.id,
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

  // Handle ending the game
  const endGame = () => {
    setIsPlaying(false);
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

  return {
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
  };
}
