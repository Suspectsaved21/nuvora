
import { Friend, Message, Partner, Location, GameAction } from "@/types/chat";

export interface ChatContextType {
  messages: Message[];
  partner: Partner | null;
  isConnecting: boolean;
  isConnected: boolean;
  isFindingPartner: boolean;
  isTyping: boolean;
  friends: Friend[];
  locationEnabled: boolean;
  userLocation: Location | null;
  sendMessage: (text: string) => void;
  sendGameAction: (action: GameAction) => void;
  setIsTyping: (typing: boolean) => void;
  findNewPartner: () => void;
  reportPartner: (reason: string) => void;
  toggleLocationTracking: () => void;
  refreshLocation: () => Promise<void>;
  blockUser: (userId: string) => void;
  unfriendUser: (userId: string) => void;
  startDirectChat: (userId: string) => void;
  startVideoCall: (userId: string) => void;
  addFriend: (userId: string) => void;
}
