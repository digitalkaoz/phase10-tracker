export type PhaseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const PHASE_DESCRIPTIONS: Record<PhaseNumber, string> = {
  1: "2 sets of 3",
  2: "1 set of 3 + 1 run of 4",
  3: "1 set of 4 + 1 run of 4",
  4: "1 run of 7",
  5: "1 run of 8",
  6: "1 run of 9",
  7: "2 sets of 4",
  8: "7 cards of one color",
  9: "1 set of 5 + 1 set of 2",
  10: "1 set of 5 + 1 set of 3",
};

export interface Player {
  id: string;
  name: string;
  currentPhase: PhaseNumber | 11; // 11 = completed all phases
  totalScore: number;
  completedGame: boolean;
}

export interface RoundEntry {
  phaseCompleted: boolean;
  score: number;
}

export interface Round {
  roundNumber: number;
  entries: Record<string, RoundEntry>; // playerId -> entry
}

export type SessionStatus = "active" | "finished";

export interface Session {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string;
  players: Player[];
  rounds: Round[];
  status: SessionStatus;
  winnerId?: string;
}

// Card types for the score calculator
export type CardType = "low" | "high" | "skip" | "wild";

export interface CardCount {
  low: number; // cards 1-9: 5 pts each
  high: number; // cards 10-12: 10 pts each
  skip: number; // 15 pts each
  wild: number; // 25 pts each
}

export const CARD_POINTS: Record<CardType, number> = {
  low: 5,
  high: 10,
  skip: 15,
  wild: 25,
};

export const CARD_LABELS: Record<CardType, string> = {
  low: "1–9",
  high: "10–12",
  skip: "Skip",
  wild: "Wild",
};
