"use server";

import { cookies, headers } from "next/headers";
import { type Locale, DEFAULT_LOCALE, LOCALES } from "~/i18n/config";

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

  const locale = acceptLanguage.split(",")[0]?.split("-")[0];
  if (!locale) return undefined;
  if (!isValidLocale(locale)) return undefined;
  return locale;
}

export async function getUserLocale(): Promise<Locale> {
  return (
    (await getCookieLocale()) ?? (await getBrowserLocale()) ?? DEFAULT_LOCALE
  );
}

export async function setUserLocale(locale: Locale): Promise<void> {
  (await cookies()).set(COOKIE_NAME, locale);
}
