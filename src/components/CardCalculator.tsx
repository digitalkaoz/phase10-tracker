import type { CardCount, CardType } from "../types/game";
import { CARD_POINTS } from "../types/game";
import { CARD_TYPE_ORDER } from "../utils/scoring";
import { useLocale } from "../i18n/useLocale";

interface Props {
  cards: CardCount;
  onUpdate: (type: CardType, delta: number) => void;
}

export function CardCalculator({ cards, onUpdate }: Props) {
  const { t } = useLocale();

  return (
    <div className="space-y-2">
      {CARD_TYPE_ORDER.map((type) => (
        <div
          key={type}
          className="flex items-center justify-between bg-p10-surface-2 rounded-2xl px-4 py-3"
        >
          <div>
            <span className="text-p10-heading text-sm font-semibold">
              {type === "low"
                ? "1–9"
                : type === "high"
                  ? "10–12"
                  : type === "skip"
                    ? "Skip"
                    : "Wild"}
            </span>
            <span className="text-p10-text-dim text-xs ml-2">
              {t.ptsEach(CARD_POINTS[type])}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onUpdate(type, -1)}
              disabled={cards[type] === 0}
              className="w-11 h-11 rounded-xl bg-p10-border disabled:opacity-30 text-p10-heading font-bold text-xl flex items-center justify-center transition-colors active:bg-p10-accent/30"
            >
              −
            </button>
            <span className="w-7 text-center text-p10-heading font-mono font-bold text-lg">
              {cards[type]}
            </span>
            <button
              onClick={() => onUpdate(type, 1)}
              className="w-11 h-11 rounded-xl bg-p10-border text-p10-heading font-bold text-xl flex items-center justify-center transition-colors active:bg-p10-accent/30"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
