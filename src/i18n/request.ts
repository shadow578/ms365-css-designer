import type { DeepPartial } from "@trpc/server";
import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "~/server/locale";

type MessageCatalog = DeepPartial<Record<string, unknown>> | null | undefined;

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  const messages = (
    (await import(`../../messages/${locale}.json`)) as {
      default: MessageCatalog;
    }
  ).default;

  return {
    locale,
    messages,
  };
});
