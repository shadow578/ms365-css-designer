import { i18n, type Messages } from "@lingui/core";
import { I18nProvider as LinguiProvider } from "@lingui/react";
import { messages as enMessages } from "~/locales/en.mjs";
import { messages as deMessages } from "~/locales/de.mjs";

import { mapRecord } from "./util";

interface LocaleDefinition {
  displayName: string;
  catalog: Messages;
}

export const locales = {
  en: {
    displayName: `English`,
    catalog: enMessages as Messages,
  },
  de: {
    displayName: `Deutsch`,
    catalog: deMessages as Messages,
  },
} satisfies Record<string, LocaleDefinition>;

export default function I18NProvider(props: { children: React.ReactNode }) {
  i18n.load(mapRecord(locales, (locale) => locale.catalog));
  i18n.activate("de");

  return <LinguiProvider i18n={i18n}>{props.children}</LinguiProvider>;
}
