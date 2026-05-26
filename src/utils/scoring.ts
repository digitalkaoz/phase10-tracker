import type { CardCount, CardType } from "../types/game";
import { CARD_POINTS } from "../types/game";

export function calcCardScore(cards: CardCount): number {
  return (
    cards.low * CARD_POINTS.low +
    cards.high * CARD_POINTS.high +
    cards.skip * CARD_POINTS.skip +
    cards.wild * CARD_POINTS.wild
  );
}

export function emptyCardCount(): CardCount {
  return { low: 0, high: 0, skip: 0, wild: 0 };
}

export function totalCards(cards: CardCount): number {
  return cards.low + cards.high + cards.skip + cards.wild;
}

export const CARD_TYPE_ORDER: CardType[] = ["low", "high", "skip", "wild"];

export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getWinner(
  players: {
    id: string;
    totalScore: number;
    currentPhase: number;
    completedGame: boolean;
  }[],
): string | undefined {
  const finishers = players.filter((p) => p.completedGame);
  if (finishers.length === 0) return undefined;
  // Lowest score among finishers wins
  return finishers.reduce((best, p) =>
    p.totalScore < best.totalScore ? p : best,
  ).id;
}
