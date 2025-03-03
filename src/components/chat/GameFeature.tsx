
import { useState, useContext, useEffect } from "react";
import { 
  GameController, 
  Clock, 
  SkipForward, 
  ThumbsUp, 
  ThumbsDown,
  Trophy,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChatContext from "@/context/ChatContext";
import { toast } from "@/components/ui/use-toast";

// Define game categories
const CATEGORIES = [
  { id: "logic", name: "Logic", icon: "🧠" },
  { id: "fun", name: "Fun", icon: "😄" },
  { id: "trivia", name: "Trivia", icon: "🎓" },
  { id: "personal", name: "Personal", icon: "👤" }
];

// Sample riddles for demo purposes
const SAMPLE_RIDDLES = [
  { 
    id: "1", 
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", 
    answer: "An echo",
    category: "logic",
    difficulty: "medium"
  },
  { 
    id: "2", 
    question: "What has keys but no locks, space but no room, and you can enter but not go in?", 
    answer: "A keyboard",
    category: "logic",
    difficulty: "easy"
  },
  { 
    id: "3", 
    question: "What gets wetter as it dries?", 
    answer: "A towel",
    category: "fun",
    difficulty: "easy"
  },
  { 
    id: "4", 
    question: "What capital has the fastest-growing population?", 
    answer: "Dublin, it's always Dublin (doublin')",
    category: "fun",
    difficulty: "medium"
  },
  { 
    id: "5", 
    question: "What's the largest planet in our solar system?", 
    answer: "Jupiter",
    category: "trivia",
    difficulty: "easy"
  }
];

// Sample questions for demo purposes
const SAMPLE_QUESTIONS = [
  { 
    id: "1", 
    question: "If you could have any superpower, what would it be and why?", 
    category: "personal"
  },
  { 
    id: "2", 
    question: "What's your favorite place you've ever traveled to?", 
    category: "personal"
  },
  { 
    id: "3", 
    question: "If you could have dinner with any historical figure, who would it be?", 
    category: "fun"
  },
  { 
    id: "4", 
    question: "What's a skill you've always wanted to learn?", 
    category: "personal"
  },
  { 
    id: "5", 
    question: "What's your favorite book or movie and why?", 
    category: "fun"
  }
];

const GameFeature = () => {
  const { partner, isConnected, sendGameAction } = useContext(ChatContext);
  const [gameType, setGameType] = useState<"riddles" | "questions">("riddles");
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
        <GameController size={18} className="mr-2" />
        Game Center
      </h3>
      
      {!isPlaying ? (
        <div className="space-y-4">
          <Tabs defaultValue="riddles" onValueChange={(value) => setGameType(value as "riddles" | "questions")}>
            <TabsList className="w-full">
              <TabsTrigger value="riddles" className="flex-1">Riddles</TabsTrigger>
              <TabsTrigger value="questions" className="flex-1">Questions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="riddles" className="pt-2">
              <p className="text-sm text-muted-foreground">
                Challenge your friend with brain teasers! Take turns solving riddles within the time limit.
              </p>
            </TabsContent>
            
            <TabsContent value="questions" className="pt-2">
              <p className="text-sm text-muted-foreground">
                Get to know each other better with fun and interesting questions!
              </p>
            </TabsContent>
          </Tabs>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Select Category</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={category === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory("all")}
                className={category === "all" ? "bg-purple" : ""}
              >
                All
              </Button>
              
              {CATEGORIES.map(cat => (
                <Button
                  key={cat.id}
                  variant={category === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat.id)}
                  className={category === cat.id ? "bg-purple" : ""}
                >
                  {cat.icon} {cat.name}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full bg-purple hover:bg-purple-dark"
            disabled={!isConnected}
            onClick={startGame}
          >
            Start Game with {partner?.username || "Partner"}
          </Button>
          
          {!isConnected && (
            <p className="text-sm text-muted-foreground text-center">
              Connect with a partner to start playing!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="flex gap-1 items-center">
              <Trophy size={14} />
              <span>{userPoints} points</span>
            </Badge>
            
            <div className="flex items-center text-sm">
              <Timer size={14} className="mr-1" />
              <span>{timeLeft}s</span>
            </div>
          </div>
          
          <Progress value={(timeLeft / 30) * 100} className="h-1" />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {gameType === "riddles" ? "Riddle" : "Question"}
              </CardTitle>
              <CardDescription>
                {gameType === "riddles" ? "Can you solve it?" : "Take turns answering"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium mb-4">{currentItem?.question}</p>
              
              {gameType === "riddles" && (
                <div>
                  {showAnswer ? (
                    <div className="bg-secondary/60 p-3 rounded-md">
                      <p className="font-semibold mb-1">Answer:</p>
                      <p>{currentItem?.answer}</p>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={revealAnswer}
                    >
                      Reveal Answer
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => rateItem(false)}
              className="flex-1"
            >
              <ThumbsDown size={16} className="mr-2" />
              Dislike
            </Button>
            
            <Button 
              variant="outline"
              onClick={nextItem}
              className="flex-1"
            >
              <SkipForward size={16} className="mr-2" />
              Skip
            </Button>
            
            <Button 
              variant="default"
              className="flex-1 bg-purple"
              onClick={() => rateItem(true)}
            >
              <ThumbsUp size={16} className="mr-2" />
              Like (+5)
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setIsPlaying(false)}
          >
            End Game
          </Button>
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
