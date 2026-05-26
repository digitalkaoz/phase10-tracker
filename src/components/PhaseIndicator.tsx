import { useLocale } from "../i18n/useLocale";
import type { PhaseNumber } from "../types/game";

const PHASES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

interface Props {
  currentPhase: PhaseNumber | 11;
  compact?: boolean;
}

export function PhaseIndicator({ currentPhase, compact = false }: Props) {
  const { t } = useLocale();

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {PHASES.map((phase) => {
          const completed = currentPhase > phase;
          const active = currentPhase === phase;
          return (
            <div
              key={phase}
              title={`Phase ${phase}: ${t.phaseDescriptions[phase]}`}
              className={`h-2 rounded-full transition-all flex-1 ${
                completed
                  ? "bg-p10-accent"
                  : active
                    ? "bg-p10-accent-light ring-1 ring-p10-accent-light ring-offset-1 ring-offset-p10-surface"
                    : "bg-p10-surface-2"
              }`}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {PHASES.map((phase) => {
        const completed = currentPhase > phase;
        const active = currentPhase === phase;
        return (
          <div
            key={phase}
            title={`Phase ${phase}: ${t.phaseDescriptions[phase]}`}
            className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-all cursor-default select-none ${
              completed
                ? "bg-p10-accent text-white"
                : active
                  ? "bg-p10-accent/20 text-p10-accent-light border border-p10-accent"
                  : "bg-p10-surface-2 text-p10-text-dim"
            }`}
          >
            {phase}
          </div>
        );
      })}
    </div>
  );
}

interface PhaseLabelProps {
  phase: PhaseNumber | 11;
}

export function PhaseLabel({ phase }: PhaseLabelProps) {
  const { t } = useLocale();
  if (phase === 11) {
    return (
      <span className="text-p10-yellow font-semibold text-sm">{t.allDone}</span>
    );
  }
  return (
    <span className="text-p10-text text-sm">
      <span className="font-semibold text-p10-accent-light">Phase {phase}</span>
      <span className="text-p10-text-dim ml-1.5 text-xs">
        {t.phaseDescriptions[phase]}
      </span>
    </span>
  );
}
