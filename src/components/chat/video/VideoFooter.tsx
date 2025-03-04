
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, GamepadIcon, MessageCircle, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatContext from '@/context/ChatContext';
import AuthContext from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface VideoFooterProps {
  isFullscreen: boolean;
  toggleChatVisibility?: () => void;
  isChatVisible?: boolean;
}

const VideoFooter = ({ 
  isFullscreen,
  toggleChatVisibility,
  isChatVisible
}: VideoFooterProps) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-2 z-40",
      isFullscreen ? "z-[60]" : ""
    )}>
      <div className="container mx-auto flex justify-around items-center">
        <Button
          variant="ghost"
          className="flex flex-col items-center text-white/80 hover:text-white hover:bg-transparent"
          asChild
        >
          <Link to="/profile">
            <UserCircle size={24} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center text-white/80 hover:text-white hover:bg-transparent"
          onClick={() => navigate('/chat', { state: { showGame: true }})}
        >
          <GamepadIcon size={24} />
          <span className="text-xs mt-1">Games</span>
        </Button>

        {toggleChatVisibility && (
          <Button
            variant="ghost"
            className="flex flex-col items-center text-white/80 hover:text-white hover:bg-transparent"
            onClick={toggleChatVisibility}
          >
            <MessageCircle size={24} />
            <span className="text-xs mt-1">Chat</span>
          </Button>
        )}

        <Button
          variant="ghost"
          className="flex flex-col items-center text-white/80 hover:text-white hover:bg-transparent"
          asChild
        >
          <Link to="/chat">
            <Users size={24} />
            <span className="text-xs mt-1">Friends</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center text-white/80 hover:text-white hover:bg-transparent"
          asChild
        >
          <Link to="/settings">
            <Settings size={24} />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default VideoFooter;
