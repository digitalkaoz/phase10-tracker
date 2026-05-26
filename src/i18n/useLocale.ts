import { createContext, useContext } from "react";
import type { Locale, Translations } from "./index";
import { TRANSLATIONS } from "./index";

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  t: TRANSLATIONS.en,
});

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
