import type { DeepPartial } from "@trpc/server";
import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "~/server/locale";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";
import deepmerge from "deepmerge";

type MessageCatalog = DeepPartial<Record<string, unknown>> | null | undefined;

async function loadMessageCatalog(locale: Locale): Promise<MessageCatalog> {
  return (
    (await import(`../../messages/${locale}.json`)) as {
      default: MessageCatalog;
    }
  ).default;
}

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  let messages: MessageCatalog;
  if (LOCALES.includes(locale as Locale)) {
    messages = await loadMessageCatalog(locale as Locale);
  }
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await loadMessageCatalog(DEFAULT_LOCALE);
    messages = deepmerge(fallback ?? {}, messages ?? {}) as MessageCatalog;
  }

  return {
    locale,
    messages,
  };
});
