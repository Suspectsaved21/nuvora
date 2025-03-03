
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameItem as GameItemType } from "@/types/game";

interface GameItemProps {
  item: GameItemType | null;
  showAnswer: boolean;
  gameType: "riddles" | "questions";
  onReveal: () => void;
}

const GameItem = ({ item, showAnswer, gameType, onReveal }: GameItemProps) => {
  if (!item) return null;
  
  return (
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
        <p className="text-lg font-medium mb-4">{item.question}</p>
        
        {gameType === "riddles" && (
          <div>
            {showAnswer ? (
              <div className="bg-secondary/60 p-3 rounded-md">
                <p className="font-semibold mb-1">Answer:</p>
                <p>{item.answer}</p>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onReveal}
              >
                Reveal Answer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameItem;
