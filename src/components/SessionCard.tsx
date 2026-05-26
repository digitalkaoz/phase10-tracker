import type { Session } from "../types/game";
import { formatDate } from "../utils/scoring";
import { useLocale } from "../i18n/useLocale";
import { TrashIcon, ChevronIcon } from "./icons";

interface Props {
  session: Session;
  onResume: (session: Session) => void;
  onDelete: (id: string) => void;
}

export function SessionCard({ session, onResume, onDelete }: Props) {
  const { t } = useLocale();
  const winner = session.winnerId
    ? session.players.find((p) => p.id === session.winnerId)
    : null;

  const playerNames = session.players.map((p) => p.name).join(", ");
  const roundCount = session.rounds.length;

  const handleDelete = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (confirm(t.deleteConfirm(playerNames))) {
      onDelete(session.id);
    }
  };

  return (
    <li
      onClick={() => onResume(session)}
      className="relative bg-p10-surface border border-p10-border rounded-2xl p-4 cursor-pointer active:border-p10-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {session.status === "active" ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-p10-green">
                <span className="w-1.5 h-1.5 rounded-full bg-p10-green inline-block" />
                {t.active}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-p10-text-dim">
                <span className="w-1.5 h-1.5 rounded-full bg-p10-text-dim inline-block" />
                {t.finished}
              </span>
            )}
            <span className="text-xs text-p10-text-dim">
              {t.rounds(roundCount)}
            </span>
          </div>
          <p className="text-p10-heading font-medium truncate">{playerNames}</p>
          {winner && (
            <p className="text-xs text-p10-yellow mt-0.5">
              {t.winner}: {winner.name} ({winner.totalScore} pts)
            </p>
          )}
          <p className="text-xs text-p10-text-dim mt-1">
            {formatDate(session.updatedAt)}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleDelete}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-p10-text-dim active:text-p10-red active:bg-p10-surface-2 transition-colors"
            aria-label={t.delete}
          >
            <TrashIcon />
          </button>
          <span className="text-p10-text-dim p-1">
            <ChevronIcon />
          </span>
        </div>
      </div>
    </li>
  );
}
