import type { Session } from "../types/game";
import { useLocale } from "../i18n/useLocale";
import { CloseIcon, StarIcon } from "./icons";

interface Props {
  session: Session;
  onClose: () => void;
}

export function RoundsHistory({ session, onClose }: Props) {
  const { t } = useLocale();

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-p10-surface border-t border-p10-border rounded-t-3xl flex flex-col"
        style={{ maxHeight: "calc(85svh - env(safe-area-inset-top))" }}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-p10-border" />
        </div>

        <div className="flex items-center justify-between px-5 pt-2 pb-4 border-b border-p10-border shrink-0">
          <h2 className="font-bold text-p10-heading text-lg">
            {t.roundHistory}
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-p10-text-dim active:text-p10-text active:bg-p10-surface-2 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {session.rounds.length === 0 ? (
          <div className="px-5 py-10 text-center text-p10-text-dim text-sm">
            {t.noRoundsYet}
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {[...session.rounds].reverse().map((round) => {
              const roundWinnerId = Object.entries(round.entries).find(
                ([, entry]) => entry.score === 0,
              )?.[0];

              return (
                <div
                  key={round.roundNumber}
                  className="bg-p10-surface-2 rounded-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-p10-border/50">
                    <p className="text-xs font-bold text-p10-text-dim uppercase tracking-wider">
                      {t.roundLabel(round.roundNumber)}
                    </p>
                    {roundWinnerId &&
                      (() => {
                        const winner = session.players.find(
                          (p) => p.id === roundWinnerId,
                        );
                        return winner ? (
                          <span className="flex items-center gap-1.5 text-xs text-p10-green font-semibold">
                            <StarIcon />
                            {t.roundWinner}: {winner.name}
                          </span>
                        ) : null;
                      })()}
                  </div>

                  <div className="divide-y divide-p10-border/30">
                    {session.players.map((player) => {
                      const entry = round.entries[player.id];
                      if (!entry) return null;
                      const isRoundWinner = player.id === roundWinnerId;

                      return (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between px-4 py-3 ${
                            isRoundWinner ? "bg-p10-green/5" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isRoundWinner && (
                              <StarIcon className="text-p10-green" />
                            )}
                            <span
                              className={`text-sm ${isRoundWinner ? "text-p10-green font-semibold" : "text-p10-text"}`}
                            >
                              {player.name}
                            </span>
                            {entry.phaseCompleted && (
                              <span className="text-xs text-p10-green bg-p10-green/10 px-1.5 py-0.5 rounded-md">
                                {t.phaseCheck}
                              </span>
                            )}
                          </div>
                          <span
                            className={`font-mono font-bold text-sm tabular-nums ${
                              isRoundWinner
                                ? "text-p10-green"
                                : "text-p10-heading"
                            }`}
                          >
                            +{entry.score}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
