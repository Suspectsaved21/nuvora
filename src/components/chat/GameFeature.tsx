
import { useContext } from "react";
import { Gamepad } from "lucide-react";
import ChatContext from "@/context/ChatContext";
import { useGame } from "@/hooks/useGame";
import GameSetup from "./game/GameSetup";
import GameHeader from "./game/GameHeader";
import GameItem from "./game/GameItem";
import GameControls from "./game/GameControls";

const GameFeature = () => {
  const { partner, isConnected } = useContext(ChatContext);
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
            onEndGame={endGame}
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
