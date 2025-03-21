
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, GamepadIcon, MessageCircle, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatContext from '@/context/ChatContext';
import AuthContext from '@/context/AuthContext';
import { useStripe } from '@/context/StripeContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

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
  const { user, hasActiveSubscription } = useContext(AuthContext);
  const { isConnected } = useContext(ChatContext);
  const { setShowSubscriptionModal } = useStripe();
  const navigate = useNavigate();

  const handleGameClick = () => {
    if (hasActiveSubscription()) {
      navigate('/games');
    } else {
      setShowSubscriptionModal(true);
      toast({
        description: "Games require a premium subscription (€1.99/month)",
      });
    }
  };

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
          onClick={handleGameClick}
        >
          <GamepadIcon size={24} />
          <span className="text-xs mt-1">Games</span>
        </Button>

        {toggleChatVisibility && (
          <Button
            variant="ghost"
            className={cn(
              "flex flex-col items-center hover:bg-transparent",
              isChatVisible 
                ? "text-white" 
                : "text-white/80 hover:text-white"
            )}
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
          <Link to="/friends">
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
