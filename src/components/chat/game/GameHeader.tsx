
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Timer } from "lucide-react";

interface GameHeaderProps {
  userPoints: number;
  timeLeft: number;
}

const GameHeader = ({ userPoints, timeLeft }: GameHeaderProps) => {
  return (
    <>
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
    </>
  );
};

export default GameHeader;
