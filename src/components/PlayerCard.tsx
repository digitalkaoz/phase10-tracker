import type { Player } from "../types/game";
import { PhaseIndicator } from "./PhaseIndicator";
import { useLocale } from "../i18n/useLocale";

interface Props {
  player: Player;
  rank: number;
  isWinner: boolean;
}

export function PlayerCard({ player, rank, isWinner }: Props) {
  const { t } = useLocale();
  return (
    <div
      className={`bg-p10-surface border rounded-2xl p-4 transition-colors ${
        isWinner
          ? "border-p10-yellow/60 bg-p10-yellow/5"
          : player.completedGame
            ? "border-p10-green/40"
            : "border-p10-border"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              rank === 0
                ? "bg-p10-orange text-white"
                : "bg-p10-surface-2 text-p10-text-dim border border-p10-border"
            }`}
          >
            {rank + 1}
          </div>
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h3 className="font-semibold text-p10-heading truncate">
              {player.name}
            </h3>
            {isWinner && <span className="text-p10-yellow text-sm">🏆</span>}
            {player.completedGame && !isWinner && (
              <span className="text-xs text-p10-green font-medium">
                {t.phaseDone}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <p className="text-2xl font-bold font-mono text-p10-heading tabular-nums">
            {player.totalScore}
          </p>
        </div>
      </div>

      {!player.completedGame ? (
        <div className="flex items-center gap-3 bg-p10-surface-2 rounded-xl px-3 py-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-p10-accent flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-extrabold">
              {player.currentPhase}
            </span>
          </div>
          <p className="text-p10-heading text-sm font-medium leading-snug">
            {t.phaseDescriptions[player.currentPhase as number]}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-p10-green/10 border border-p10-green/30 rounded-xl px-3 py-2.5 mb-3">
          <span className="text-p10-green text-sm font-semibold">
            {t.allDone}
          </span>
        </div>
      )}

      <PhaseIndicator currentPhase={player.currentPhase} compact />
    </div>
  );
}
