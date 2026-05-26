import { useState } from "react";
import { useLocale } from "../i18n/useLocale";
import { BackIcon, CloseIcon } from "./icons";

interface Props {
  onStart: (playerNames: string[]) => void;
  onBack: () => void;
}

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;

export function GameSetup({ onStart, onBack }: Props) {
  const { t } = useLocale();
  const [names, setNames] = useState<string[]>(["", ""]);

  const addPlayer = () => {
    if (names.length < MAX_PLAYERS) {
      setNames((prev) => [...prev, ""]);
    }
  };

  const removePlayer = (index: number) => {
    if (names.length > MIN_PLAYERS) {
      setNames((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateName = (index: number, value: string) => {
    setNames((prev) => prev.map((n, i) => (i === index ? value : n)));
  };

  const handleStart = () => {
    const trimmed = names.map((n) => n.trim()).filter(Boolean);
    if (trimmed.length < MIN_PLAYERS) return;
    onStart(trimmed);
  };

  const filledNames = names.map((n) => n.trim()).filter(Boolean);
  const canStart = filledNames.length >= MIN_PLAYERS;

  return (
    <div className="min-h-screen bg-p10-bg flex flex-col items-center px-4 py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
      <div className="w-full max-w-md mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-p10-text-dim active:text-p10-text transition-colors text-sm mb-6 min-h-[44px]"
        >
          <BackIcon />
          {t.back}
        </button>
        <h1 className="text-3xl font-bold text-p10-heading tracking-tight">
          {t.newGameTitle}
        </h1>
        <p className="text-p10-text-dim text-sm mt-1">
          {t.newGameSubtitle(MIN_PLAYERS, MAX_PLAYERS)}
        </p>
      </div>

      <div className="w-full max-w-md space-y-3 mb-6">
        {names.map((name, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-p10-accent w-5 text-center select-none">
                {i + 1}
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => updateName(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (i === names.length - 1 && names.length < MAX_PLAYERS) {
                      addPlayer();
                    } else if (i === names.length - 1 && canStart) {
                      handleStart();
                    }
                  }
                }}
                placeholder={t.playerPlaceholder(i + 1)}
                maxLength={20}
                autoFocus={i === 0}
                className="w-full bg-p10-surface border border-p10-border rounded-xl pl-9 pr-4 py-3.5 text-p10-heading placeholder:text-p10-text-dim focus:outline-none focus:border-p10-accent transition-colors"
              />
            </div>
            {names.length > MIN_PLAYERS && (
              <button
                onClick={() => removePlayer(i)}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-p10-text-dim active:text-p10-red active:bg-p10-surface transition-colors"
                aria-label="Remove player"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        ))}
      </div>

      {names.length < MAX_PLAYERS && (
        <button
          onClick={addPlayer}
          className="w-full max-w-md py-3 rounded-2xl border border-dashed border-p10-border text-p10-text-dim active:border-p10-accent active:text-p10-accent-light transition-colors text-sm font-medium mb-8 min-h-[52px]"
        >
          {t.addPlayer}
        </button>
      )}
      {names.length >= MAX_PLAYERS && <div className="mb-8" />}

      <button
        onClick={handleStart}
        disabled={!canStart}
        className="w-full max-w-md py-4 rounded-2xl bg-p10-accent active:bg-p10-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors min-h-[56px]"
      >
        {t.startGame}
      </button>

      {!canStart && (
        <p className="text-p10-text-dim text-xs mt-3">
          {t.minPlayersHint(MIN_PLAYERS)}
        </p>
      )}
    </div>
  );
}
