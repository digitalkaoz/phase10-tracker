import { describe, it, expect } from "vitest";
import {
  calcCardScore,
  emptyCardCount,
  totalCards,
  CARD_TYPE_ORDER,
  formatDate,
  getWinner,
} from "./scoring";
import type { CardCount } from "../types/game";
import { CARD_POINTS } from "../types/game";

// ---------------------------------------------------------------------------
// calcCardScore
// ---------------------------------------------------------------------------

describe("calcCardScore", () => {
  it("returns 0 for an empty hand", () => {
    expect(calcCardScore(emptyCardCount())).toBe(0);
  });

  it("scores low cards at 5 pts each", () => {
    expect(calcCardScore({ low: 3, high: 0, skip: 0, wild: 0 })).toBe(15);
  });

  it("scores high cards at 10 pts each", () => {
    expect(calcCardScore({ low: 0, high: 2, skip: 0, wild: 0 })).toBe(20);
  });

  it("scores skip cards at 15 pts each", () => {
    expect(calcCardScore({ low: 0, high: 0, skip: 1, wild: 0 })).toBe(15);
  });

  it("scores wild cards at 25 pts each", () => {
    expect(calcCardScore({ low: 0, high: 0, skip: 0, wild: 2 })).toBe(50);
  });

  it("sums all card types correctly", () => {
    // 2×5 + 1×10 + 1×15 + 1×25 = 10+10+15+25 = 60
    const hand: CardCount = { low: 2, high: 1, skip: 1, wild: 1 };
    expect(calcCardScore(hand)).toBe(60);
  });

  it("matches the CARD_POINTS constants", () => {
    const hand: CardCount = { low: 1, high: 1, skip: 1, wild: 1 };
    const expected =
      CARD_POINTS.low + CARD_POINTS.high + CARD_POINTS.skip + CARD_POINTS.wild;
    expect(calcCardScore(hand)).toBe(expected);
  });

  it("handles large hand counts", () => {
    const hand: CardCount = { low: 9, high: 3, skip: 2, wild: 2 };
    // 9×5 + 3×10 + 2×15 + 2×25 = 45+30+30+50 = 155
    expect(calcCardScore(hand)).toBe(155);
  });
});

// ---------------------------------------------------------------------------
// emptyCardCount
// ---------------------------------------------------------------------------

describe("emptyCardCount", () => {
  it("returns all zeros", () => {
    const c = emptyCardCount();
    expect(c.low).toBe(0);
    expect(c.high).toBe(0);
    expect(c.skip).toBe(0);
    expect(c.wild).toBe(0);
  });

  it("returns a new object each call (no shared reference)", () => {
    const a = emptyCardCount();
    const b = emptyCardCount();
    a.low = 99;
    expect(b.low).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// totalCards
// ---------------------------------------------------------------------------

describe("totalCards", () => {
  it("returns 0 for an empty hand", () => {
    expect(totalCards(emptyCardCount())).toBe(0);
  });

  it("sums all card types", () => {
    expect(totalCards({ low: 3, high: 2, skip: 1, wild: 1 })).toBe(7);
  });

  it("works when only one type is non-zero", () => {
    expect(totalCards({ low: 5, high: 0, skip: 0, wild: 0 })).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// CARD_TYPE_ORDER
// ---------------------------------------------------------------------------

describe("CARD_TYPE_ORDER", () => {
  it("contains exactly four card types", () => {
    expect(CARD_TYPE_ORDER).toHaveLength(4);
  });

  it("contains low, high, skip, and wild", () => {
    expect(CARD_TYPE_ORDER).toContain("low");
    expect(CARD_TYPE_ORDER).toContain("high");
    expect(CARD_TYPE_ORDER).toContain("skip");
    expect(CARD_TYPE_ORDER).toContain("wild");
  });

  it("is ordered low → high → skip → wild (ascending point value)", () => {
    expect(CARD_TYPE_ORDER).toEqual(["low", "high", "skip", "wild"]);
    // Verify the order actually matches ascending points
    const points = CARD_TYPE_ORDER.map((t) => CARD_POINTS[t]);
    expect(points).toEqual([...points].sort((a, b) => a - b));
  });
});

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

describe("formatDate", () => {
  it("returns a non-empty string for a valid ISO date", () => {
    const result = formatDate("2026-05-26T10:00:00.000Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("includes the year in the output", () => {
    const result = formatDate("2026-05-26T10:00:00.000Z");
    expect(result).toMatch(/2026/);
  });

  it("handles the epoch without throwing", () => {
    expect(() => formatDate("1970-01-01T00:00:00.000Z")).not.toThrow();
  });

  it("handles a date at end of year without throwing", () => {
    expect(() => formatDate("2025-12-31T23:59:59.999Z")).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// getWinner
// ---------------------------------------------------------------------------

describe("getWinner", () => {
  const base = { currentPhase: 11 as number, completedGame: true };

  it("returns undefined when no player has completed the game", () => {
    const players = [
      { id: "a", totalScore: 50, currentPhase: 5, completedGame: false },
      { id: "b", totalScore: 30, currentPhase: 7, completedGame: false },
    ];
    expect(getWinner(players)).toBeUndefined();
  });

  it("returns the id of the single finisher", () => {
    const players = [
      { id: "a", totalScore: 80, ...base },
      { id: "b", totalScore: 120, currentPhase: 8, completedGame: false },
    ];
    expect(getWinner(players)).toBe("a");
  });

  it("returns the finisher with the lowest score when multiple finished", () => {
    const players = [
      { id: "a", totalScore: 120, ...base },
      { id: "b", totalScore: 85, ...base },
      { id: "c", totalScore: 200, ...base },
    ];
    expect(getWinner(players)).toBe("b");
  });

  it("returns the first finisher when scores are tied", () => {
    // reduce keeps the first 'best' when scores are equal
    const players = [
      { id: "a", totalScore: 100, ...base },
      { id: "b", totalScore: 100, ...base },
    ];
    expect(getWinner(players)).toBe("a");
  });

  it("ignores non-finishers even if they have a lower score", () => {
    const players = [
      { id: "a", totalScore: 5, currentPhase: 9, completedGame: false },
      { id: "b", totalScore: 150, ...base },
    ];
    expect(getWinner(players)).toBe("b");
  });

  it("returns undefined for an empty player list", () => {
    expect(getWinner([])).toBeUndefined();
  });

  it("handles a single player who finished", () => {
    const players = [{ id: "solo", totalScore: 45, ...base }];
    expect(getWinner(players)).toBe("solo");
  });

  it("returns the finisher with score 0 when they went out first", () => {
    const players = [
      { id: "winner", totalScore: 0, ...base },
      { id: "loser", totalScore: 95, ...base },
    ];
    expect(getWinner(players)).toBe("winner");
  });
});
