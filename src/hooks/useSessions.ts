import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Session, Player, PhaseNumber } from "../types/game";

const STORAGE_KEY = "phase10_sessions";

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

export function useSessions() {
  const [sessions, setSessions] = useLocalStorage<Session[]>(STORAGE_KEY, []);

  const createSession = useCallback(
    (playerNames: string[]): Session => {
      const players: Player[] = playerNames.map((name) => ({
        id: generateId(),
        name,
        currentPhase: 1 as PhaseNumber,
        totalScore: 0,
        completedGame: false,
      }));

      const session: Session = {
        id: generateId(),
        createdAt: now(),
        updatedAt: now(),
        players,
        rounds: [],
        status: "active",
      };

      setSessions((prev) => [session, ...prev]);
      return session;
    },
    [setSessions],
  );

  const updateSession = useCallback(
    (updated: Session) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === updated.id ? { ...updated, updatedAt: now() } : s,
        ),
      );
    },
    [setSessions],
  );

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
    },
    [setSessions],
  );

  const getSession = useCallback(
    (id: string): Session | undefined => {
      return sessions.find((s) => s.id === id);
    },
    [sessions],
  );

  return {
    sessions,
    createSession,
    updateSession,
    deleteSession,
    getSession,
  };
}
