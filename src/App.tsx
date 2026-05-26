import { useState, useCallback } from "react";
import type { Session } from "./types/game";
import { useSessions } from "./hooks/useSessions";
import { SessionPicker } from "./components/SessionPicker";
import { GameSetup } from "./components/GameSetup";
import { GameBoard } from "./components/GameBoard";
import { LocaleContext } from "./i18n/useLocale";
import type { Locale } from "./i18n/index";
import { TRANSLATIONS } from "./i18n/index";
import { useLocalStorage } from "./hooks/useLocalStorage";

type View =
  | { name: "picker" }
  | { name: "setup" }
  | { name: "game"; sessionId: string };

export default function App() {
  const [view, setView] = useState<View>({ name: "picker" });
  const [locale, setLocale] = useLocalStorage<Locale>("p10_locale", "en");
  const { sessions, createSession, updateSession, deleteSession, getSession } =
    useSessions();

  const goToPicker = useCallback(() => setView({ name: "picker" }), []);
  const goToSetup = useCallback(() => setView({ name: "setup" }), []);

  const handleNewGame = useCallback(
    (playerNames: string[]) => {
      const session = createSession(playerNames);
      setView({ name: "game", sessionId: session.id });
    },
    [createSession],
  );

  const handleResume = useCallback((session: Session) => {
    setView({ name: "game", sessionId: session.id });
  }, []);

  const handleUpdateSession = useCallback(
    (updated: Session) => {
      updateSession(updated);
    },
    [updateSession],
  );

  const localeCtx = {
    locale,
    setLocale,
    t: TRANSLATIONS[locale],
  };

  const renderView = () => {
    if (view.name === "picker") {
      return (
        <SessionPicker
          sessions={sessions}
          onNew={goToSetup}
          onResume={handleResume}
          onDelete={deleteSession}
        />
      );
    }

    if (view.name === "setup") {
      return <GameSetup onStart={handleNewGame} onBack={goToPicker} />;
    }

    if (view.name === "game") {
      const session = getSession(view.sessionId);
      if (!session) {
        return (
          <SessionPicker
            sessions={sessions}
            onNew={goToSetup}
            onResume={handleResume}
            onDelete={deleteSession}
          />
        );
      }
      return (
        <GameBoard
          session={session}
          onUpdate={handleUpdateSession}
          onBack={goToPicker}
        />
      );
    }

    return null;
  };

  return (
    <LocaleContext.Provider value={localeCtx}>
      <div className="flex min-h-svh flex-col">
        <div className="flex-1">{renderView()}</div>
        <footer className="pb-2 text-center text-xs text-p10-text-dim">
          <a
            href="https://github.com/digitalkaoz/phase10-tracker"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </footer>
      </div>
    </LocaleContext.Provider>
  );
}
