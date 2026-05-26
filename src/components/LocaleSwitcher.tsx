import type { Locale } from "../i18n/index";

interface Props {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export function LocaleSwitcher({ locale, setLocale }: Props) {
  return (
    <div className="flex gap-1 bg-p10-surface border border-p10-border rounded-xl p-1 shrink-0 mt-1">
      {(["en", "de"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors min-w-[44px] min-h-[36px] ${
            locale === l
              ? "bg-p10-accent text-white"
              : "text-p10-text-dim active:text-p10-text"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
