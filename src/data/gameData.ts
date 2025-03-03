
import { GameItem, GameCategory } from "@/types/game";

// Define game categories
export const GAME_CATEGORIES: GameCategory[] = [
  { id: "logic", name: "Logic", icon: "🧠" },
  { id: "fun", name: "Fun", icon: "😄" },
  { id: "trivia", name: "Trivia", icon: "🎓" },
  { id: "personal", name: "Personal", icon: "👤" }
];

// Sample riddles for demo purposes
export const SAMPLE_RIDDLES: GameItem[] = [
  { 
    id: "1", 
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", 
    answer: "An echo",
    category: "logic",
    difficulty: "medium"
  },
  { 
    id: "2", 
    question: "What has keys but no locks, space but no room, and you can enter but not go in?", 
    answer: "A keyboard",
    category: "logic",
    difficulty: "easy"
  },
  { 
    id: "3", 
    question: "What gets wetter as it dries?", 
    answer: "A towel",
    category: "fun",
    difficulty: "easy"
  },
  { 
    id: "4", 
    question: "What capital has the fastest-growing population?", 
    answer: "Dublin, it's always Dublin (doublin')",
    category: "fun",
    difficulty: "medium"
  },
  { 
    id: "5", 
    question: "What's the largest planet in our solar system?", 
    answer: "Jupiter",
    category: "trivia",
    difficulty: "easy"
  }
];

// Sample questions for demo purposes
export const SAMPLE_QUESTIONS: GameItem[] = [
  { 
    id: "1", 
    question: "If you could have any superpower, what would it be and why?", 
    category: "personal"
  },
  { 
    id: "2", 
    question: "What's your favorite place you've ever traveled to?", 
    category: "personal"
  },
  { 
    id: "3", 
    question: "If you could have dinner with any historical figure, who would it be?", 
    category: "fun"
  },
  { 
    id: "4", 
    question: "What's a skill you've always wanted to learn?", 
    category: "personal"
  },
  { 
    id: "5", 
    question: "What's your favorite book or movie and why?", 
    category: "fun"
  }
];
