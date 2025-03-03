
import { Button } from "@/components/ui/button";
import { SkipForward, ThumbsUp, ThumbsDown } from "lucide-react";

interface GameControlsProps {
  onReveal: () => void;
  onNext: () => void;
  onRate: (liked: boolean) => void;
  onEndGame: () => void;
  showAnswer: boolean;
  gameType: "riddles" | "questions";
}

const GameControls = ({ 
  onReveal, 
  onNext, 
  onRate, 
  onEndGame,
  showAnswer,
  gameType
}: GameControlsProps) => {
  return (
    <div className="space-y-4">
      {gameType === "riddles" && !showAnswer && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onReveal}
        >
          Reveal Answer
        </Button>
      )}
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onRate(false)}
          className="flex-1"
        >
          <ThumbsDown size={16} className="mr-2" />
          Dislike
        </Button>
        
        <Button 
          variant="outline"
          onClick={onNext}
          className="flex-1"
        >
          <SkipForward size={16} className="mr-2" />
          Skip
        </Button>
        
        <Button 
          variant="default"
          className="flex-1 bg-purple"
          onClick={() => onRate(true)}
        >
          <ThumbsUp size={16} className="mr-2" />
          Like (+5)
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={onEndGame}
      >
        End Game
      </Button>
    </div>
  );
};

export default GameControls;
