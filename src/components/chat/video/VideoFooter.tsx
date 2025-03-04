
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, GamepadIcon, MessageCircle, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatContext } from '@/context/chat';
import AuthContext from '@/context/AuthContext';
import { useStripe } from '@/context/StripeContext';
import { Button } from '@/components/ui/button';

interface VideoFooterProps {
  isFullscreen: boolean;
  toggleChatVisibility: () => void;
  isChatVisible: boolean;
}

const VideoFooter = ({ 
  isFullscreen,
  toggleChatVisibility,
  isChatVisible
}: VideoFooterProps) => {
  const { user } = useContext(AuthContext);
  const { setShowSubscriptionModal } = useStripe();
  const navigate = useNavigate();
  
  return (
    <div className={cn(
      "absolute bottom-0 left-0 right-0 flex justify-around items-center h-16 bg-black/50 text-white z-30"
      // Removed conditional hiding when in fullscreen
    )}>
      <Link to="/profile">
        <div className="flex flex-col items-center hover:text-gray-300">
          <UserCircle size={24} />
          <span className="text-xs">Profile</span>
        </div>
      </Link>
      
      <Button
        variant="ghost"
        onClick={() => navigate("/games")}
        className="flex flex-col items-center hover:text-gray-300 p-0"
      >
        <GamepadIcon size={24} />
        <span className="text-xs">Games</span>
      </Button>
      
      <Button
        variant="ghost"
        onClick={toggleChatVisibility}
        className="flex flex-col items-center hover:text-gray-300 p-0"
      >
        <MessageCircle size={24} />
        <span className="text-xs">{isChatVisible ? 'Hide Chat' : 'Show Chat'}</span>
      </Button>
      
      <Button
        variant="ghost"
        onClick={() => navigate("/friends")}
        className="flex flex-col items-center hover:text-gray-300 p-0"
      >
        <Users size={24} />
        <span className="text-xs">Friends</span>
      </Button>
      
      <Button
        variant="ghost"
        onClick={() => navigate("/settings")}
        className="flex flex-col items-center hover:text-gray-300 p-0"
      >
        <Settings size={24} />
        <span className="text-xs">Settings</span>
      </Button>
    </div>
  );
};

export default VideoFooter;
