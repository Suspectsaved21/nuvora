
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategorySelector from "./CategorySelector";
import { GameType } from "@/types/game";

interface GameSetupProps {
  gameType: GameType;
  setGameType: (type: GameType) => void;
  category: string;
  setCategory: (category: string) => void;
  onStartGame: () => void;
  isConnected: boolean;
  partnerName: string | undefined;
}

const GameSetup = ({ 
  gameType, 
  setGameType, 
  category, 
  setCategory, 
  onStartGame, 
  isConnected,
  partnerName
}: GameSetupProps) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue={gameType} onValueChange={(value) => setGameType(value as GameType)}>
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
      
      <CategorySelector category={category} setCategory={setCategory} />
      
      <Button 
        className="w-full bg-purple hover:bg-purple-dark"
        disabled={!isConnected}
        onClick={onStartGame}
      >
        Start Game with {partnerName || "Partner"}
      </Button>
      
      {!isConnected && (
        <p className="text-sm text-muted-foreground text-center">
          Connect with a partner to start playing!
        </p>
      )}
    </div>
  );
};

export default GameSetup;
