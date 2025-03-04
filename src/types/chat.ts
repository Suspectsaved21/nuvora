
export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isOwn: boolean;
}

export interface Friend {
  id: string;
  username: string;
  country?: string;
  language?: string;
  status: "online" | "offline" | "blocked" | "active";
  lastSeen?: number;
  blocked?: boolean;
  pending?: boolean;
}

export interface Partner {
  id: string;
  username: string;
  country?: string;
  language?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  country?: string;
  city?: string;
}

export interface GameAction {
  action: "start" | "next" | "reveal" | "rate" | "answer";
  gameType: "riddles" | "questions";
  category?: string;
  itemId?: string;
  answer?: string;
  liked?: boolean;
}
