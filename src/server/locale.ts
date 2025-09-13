"use server";

import { cookies, headers } from "next/headers";
import { type Locale, DEFAULT_LOCALE, LOCALES } from "~/i18n/config";
import { parse as parseAcceptLanguageHeader } from "accept-language-parser";

const COOKIE_NAME = "NEXT_LOCALE";

function isValidLocale(locale: string): locale is Locale {
  return (LOCALES as string[]).includes(locale);
}

async function getCookieLocale(): Promise<Locale | undefined> {
  const cookieLocale = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookieLocale) return undefined;
  if (!isValidLocale(cookieLocale)) return undefined;
  return cookieLocale;
}

async function getBrowserLocale(): Promise<Locale | undefined> {
  const acceptLanguage = (await headers()).get("accept-language");
  if (!acceptLanguage) return undefined;

  // find the first valid locale (has highest quality)
  const parsed = parseAcceptLanguageHeader(acceptLanguage).sort(
    (a, b) => b.quality - a.quality,
  );

  for (const lang of parsed) {
    if (isValidLocale(lang.code)) {
      return lang.code;
    }
  }

  return undefined;
}

export async function getUserLocale(): Promise<Locale> {
  return (
    (await getCookieLocale()) ?? (await getBrowserLocale()) ?? DEFAULT_LOCALE
  );
}

export async function setUserLocale(locale: Locale): Promise<void> {
  (await cookies()).set(COOKIE_NAME, locale);
}
