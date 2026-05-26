import { useState, useEffect } from "react";
import type { Player, CardCount, CardType } from "../types/game";
import { PHASE_DESCRIPTIONS } from "../types/game";
import { calcCardScore, emptyCardCount } from "../utils/scoring";
import { useLocale } from "../i18n/useLocale";
import { CardCalculator } from "./CardCalculator";
import { CloseIcon } from "./icons";

export interface PlayerRoundEntry {
  playerId: string;
  phaseCompleted: boolean;
  score: number;
}

interface Props {
  players: Player[];
  roundNumber: number;
  onSubmit: (entries: PlayerRoundEntry[]) => void;
  onCancel: () => void;
}

interface PlayerEntryState {
  phaseCompleted: boolean;
  mode: "cards" | "manual";
  cards: CardCount;
  manualScore: string;
}

function initState(players: Player[]): Record<string, PlayerEntryState> {
  const state: Record<string, PlayerEntryState> = {};
  for (const p of players) {
    state[p.id] = {
      phaseCompleted: false,
      mode: "manual",
      cards: emptyCardCount(),
      manualScore: "",
    };
  }
  return state;
}

export function ScoreEntryModal({
  players,
  roundNumber,
  onSubmit,
  onCancel,
}: Props) {
  const { t } = useLocale();
  const [entries, setEntries] = useState<Record<string, PlayerEntryState>>(() =>
    initState(players),
  );
  const [activePlayer, setActivePlayer] = useState<string>(
    players[0]?.id ?? "",
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setEntries(initState(players));
    setActivePlayer(players[0]?.id ?? "");
    setValidationError(null);
  }, [players]);

  const updateEntry = (playerId: string, patch: Partial<PlayerEntryState>) => {
    setEntries((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], ...patch },
    }));
    setValidationError(null);
  };

  const updateCard = (playerId: string, type: CardType, delta: number) => {
    setEntries((prev) => {
      const current = prev[playerId].cards[type];
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        [playerId]: {
          ...prev[playerId],
          cards: { ...prev[playerId].cards, [type]: next },
        },
      };
    });
    setValidationError(null);
  };

  const getScore = (playerId: string): number => {
    const e = entries[playerId];
    if (!e) return 0;
    if (e.mode === "manual") {
      const v = parseInt(e.manualScore, 10);
      return isNaN(v) ? 0 : Math.max(0, v);
    }
    return calcCardScore(e.cards);
  };

  const handleSubmit = () => {
    const activePlayers = players.filter((p) => !p.completedGame);
    const zeroScorers = activePlayers.filter((p) => getScore(p.id) === 0);
    if (zeroScorers.length > 1) {
      setValidationError(t.validationTooManyZeros);
      return;
    }

    const result: PlayerRoundEntry[] = players.map((p) => ({
      playerId: p.id,
      phaseCompleted: entries[p.id]?.phaseCompleted ?? false,
      score: getScore(p.id),
    }));
    onSubmit(result);
  };

  const activePlayers = players.filter((p) => !p.completedGame);
  const finishedPlayers = players.filter((p) => p.completedGame);

  const goToNext = (currentId: string) => {
    const idx = activePlayers.findIndex((p) => p.id === currentId);
    if (idx < activePlayers.length - 1) {
      setActivePlayer(activePlayers[idx + 1].id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-p10-surface border-t border-p10-border rounded-t-3xl shadow-2xl flex flex-col"
        style={{ maxHeight: "calc(95svh - env(safe-area-inset-top))" }}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-p10-border" />
        </div>

        <div className="flex items-center justify-between px-5 pt-2 pb-4 border-b border-p10-border shrink-0">
          <h2 className="text-lg font-bold text-p10-heading">
            {t.roundScores(roundNumber)}
          </h2>
          <button
            onClick={onCancel}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-p10-text-dim active:text-p10-text active:bg-p10-surface-2 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex gap-2 px-4 pt-3 pb-2 overflow-x-auto shrink-0 no-scrollbar">
          {activePlayers.map((p) => {
            const score = getScore(p.id);
            const isDone = entries[p.id]?.phaseCompleted;
            return (
              <button
                key={p.id}
                onClick={() => setActivePlayer(p.id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex flex-col items-center gap-0.5 ${
                  activePlayer === p.id
                    ? "bg-p10-accent text-white"
                    : "bg-p10-surface-2 text-p10-text-dim"
                }`}
              >
                <span>{p.name}</span>
                <span
                  className={`text-xs font-mono ${activePlayer === p.id ? "text-white/70" : "text-p10-text-dim"}`}
                >
                  {score}
                  {isDone ? " ✓" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {validationError && (
          <div className="mx-4 mb-2 px-4 py-2.5 bg-p10-red/10 border border-p10-red/40 rounded-xl text-p10-red text-sm shrink-0">
            {validationError}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
          {activePlayers.map((player) => {
            if (activePlayer !== player.id) return null;
            const entry = entries[player.id];
            const score = getScore(player.id);
            const currentPhase = player.currentPhase;

            return (
              <div key={player.id} className="space-y-4">
                <div className="flex items-center justify-between bg-p10-surface-2 rounded-2xl px-4 py-3.5">
                  <div>
                    <p className="text-p10-heading font-semibold">
                      {player.name}
                    </p>
                    {currentPhase !== 11 && (
                      <p className="text-xs text-p10-text-dim mt-0.5">
                        Phase {currentPhase}: {PHASE_DESCRIPTIONS[currentPhase]}
                      </p>
                    )}
                  </div>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <span className="text-sm text-p10-text-dim">
                      {t.phaseQuestion}
                    </span>
                    <button
                      role="switch"
                      aria-checked={entry.phaseCompleted}
                      onClick={() => {
                        updateEntry(player.id, {
                          phaseCompleted: !entry.phaseCompleted,
                        });
                        if (!entry.phaseCompleted) goToNext(player.id);
                      }}
                      className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                        entry.phaseCompleted
                          ? "bg-p10-green"
                          : "bg-p10-surface-2 border border-p10-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                          entry.phaseCompleted ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </label>
                </div>

                <div className="flex gap-1 bg-p10-surface-2 p-1 rounded-2xl">
                  <button
                    onClick={() => updateEntry(player.id, { mode: "manual" })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                      entry.mode === "manual"
                        ? "bg-p10-accent text-white"
                        : "text-p10-text-dim"
                    }`}
                  >
                    {t.manual}
                  </button>
                  <button
                    onClick={() => updateEntry(player.id, { mode: "cards" })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                      entry.mode === "cards"
                        ? "bg-p10-accent text-white"
                        : "text-p10-text-dim"
                    }`}
                  >
                    {t.cardCalculator}
                  </button>
                </div>

                {entry.mode === "manual" && (
                  <div className="bg-p10-surface-2 rounded-2xl px-4 py-4">
                    <label className="block text-sm text-p10-text-dim mb-3">
                      {t.pointsLabel}
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      step="5"
                      value={entry.manualScore}
                      onChange={(e) =>
                        updateEntry(player.id, { manualScore: e.target.value })
                      }
                      placeholder="0"
                      autoFocus
                      className="w-full bg-p10-bg border border-p10-border rounded-xl px-4 py-4 text-p10-heading text-3xl font-mono text-center focus:outline-none focus:border-p10-accent transition-colors"
                    />
                  </div>
                )}

                {entry.mode === "cards" && (
                  <CardCalculator
                    cards={entry.cards}
                    onUpdate={(type, delta) =>
                      updateCard(player.id, type, delta)
                    }
                  />
                )}

                <div className="flex items-center justify-between px-4 py-4 bg-p10-accent/10 border border-p10-accent/30 rounded-2xl">
                  <span className="text-p10-text-dim text-sm">
                    {t.pointsThisRound}
                  </span>
                  <span className="text-p10-accent-light font-bold text-3xl font-mono">
                    {score}
                  </span>
                </div>
              </div>
            );
          })}

          {finishedPlayers.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-p10-text-dim uppercase tracking-wider px-1">
                {t.alreadyFinished}
              </p>
              {finishedPlayers.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between bg-p10-surface-2/50 rounded-xl px-4 py-3 opacity-50"
                >
                  <span className="text-p10-text text-sm">{p.name}</span>
                  <span className="text-p10-text-dim text-xs">
                    {t.completedGame}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="flex gap-3 px-4 py-4 border-t border-p10-border shrink-0"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl border border-p10-border text-p10-text-dim font-medium min-h-[52px] active:border-p10-text-dim transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3.5 rounded-2xl bg-p10-accent active:bg-p10-accent-hover text-white font-semibold min-h-[52px] transition-colors"
          >
            {t.saveRound}
          </button>
        </div>
      </div>
    </div>
  );
}
