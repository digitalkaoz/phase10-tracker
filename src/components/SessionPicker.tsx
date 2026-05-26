import type { Session } from "../types/game";
import { useLocale } from "../i18n/useLocale";
import { SessionCard } from "./SessionCard";
import { LocaleSwitcher } from "./LocaleSwitcher";

interface Props {
  sessions: Session[];
  onNew: () => void;
  onResume: (session: Session) => void;
  onDelete: (id: string) => void;
}

export function SessionPicker({ sessions, onNew, onResume, onDelete }: Props) {
  const { t, locale, setLocale } = useLocale();
  const active = sessions.filter((s) => s.status === "active");
  const finished = sessions.filter((s) => s.status === "finished");

  return (
    <div className="min-h-screen bg-p10-bg flex flex-col items-center px-4 py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="w-full max-w-md flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-p10-heading tracking-tight mb-1">
            {t.appTitle}
          </h1>
          <p className="text-p10-text-dim text-sm">{t.appSubtitle}</p>
        </div>
        <LocaleSwitcher locale={locale} setLocale={setLocale} />
      </div>

      <button
        onClick={onNew}
        className="w-full max-w-md mb-8 py-4 rounded-2xl bg-p10-accent active:bg-p10-accent-hover text-white font-semibold text-lg transition-colors"
      >
        {t.newGame}
      </button>

      {sessions.length === 0 && (
        <div className="text-p10-text-dim text-sm mt-4 text-center">
          {t.noSessions}
        </div>
      )}

      {active.length > 0 && (
        <section className="w-full max-w-md mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-p10-text-dim mb-3">
            {t.inProgress}
          </h2>
          <ul className="space-y-3">
            {active.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                onResume={onResume}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </section>
      )}

      {finished.length > 0 && (
        <section className="w-full max-w-md">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-p10-text-dim mb-3">
            {t.completed}
          </h2>
          <ul className="space-y-3">
            {finished.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                onResume={onResume}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
