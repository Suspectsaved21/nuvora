
import { GameAction } from './chat';

export interface GameItem {
  id: string;
  question: string;
  answer?: string;
  category: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface GameCategory {
  id: string;
  name: string;
  icon: string;
}

export type GameType = "riddles" | "questions";
