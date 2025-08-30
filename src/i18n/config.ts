export const LOCALES_CONFIG = {
  en: { flag: "gb" },
  de: { flag: "de" },
} as const;
export type Locale = keyof typeof LOCALES_CONFIG;

export const LOCALES = Object.keys(LOCALES_CONFIG) as Locale[];
export const DEFAULT_LOCALE: Locale = "en";
