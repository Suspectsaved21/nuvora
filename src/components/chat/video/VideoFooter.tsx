
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, GamepadIcon, MessageCircle, Search, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatContext from '@/context/ChatContext';
import AuthContext from '@/context/AuthContext';
import { useStripe } from '@/context/StripeContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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

  const iconSize = isMobile ? 20 : 24;
  const textSize = isMobile ? "text-[10px]" : "text-xs";

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1 z-40",
      isFullscreen ? "z-[60]" : ""
    )}>
      <div className="container mx-auto flex justify-around items-center">
        <Button
          variant="ghost"
          className={`flex flex-col items-center text-white/80 hover:text-white hover:bg-transparent ${isMobile ? 'px-2' : 'px-4'}`}
          asChild
        >
          <Link to="/profile">
            <UserCircle size={iconSize} />
            <span className={`${textSize} mt-1`}>Profile</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={`flex flex-col items-center text-white/80 hover:text-white hover:bg-transparent ${isMobile ? 'px-2' : 'px-4'}`}
          asChild
        >
          <Link to="/search">
            <Search size={iconSize} />
            <span className={`${textSize} mt-1`}>Search</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={`flex flex-col items-center text-white/80 hover:text-white hover:bg-transparent ${isMobile ? 'px-2' : 'px-4'}`}
          onClick={handleGameClick}
        >
          <GamepadIcon size={iconSize} />
          <span className={`${textSize} mt-1`}>Games</span>
        </Button>

        {toggleChatVisibility && (
          <Button
            variant="ghost"
            className={cn(
              `flex flex-col items-center hover:bg-transparent ${isMobile ? 'px-2' : 'px-4'}`,
              isChatVisible 
                ? "text-white" 
                : "text-white/80 hover:text-white"
            )}
            onClick={toggleChatVisibility}
          >
            <MessageCircle size={iconSize} />
            <span className={`${textSize} mt-1`}>Chat</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          className={`flex flex-col items-center text-white/80 hover:text-white hover:bg-transparent ${isMobile ? 'px-2' : 'px-4'}`}
          asChild
        >
          <Link to="/friends">
            <Users size={iconSize} />
            <span className={`${textSize} mt-1`}>Friends</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default VideoFooter;
