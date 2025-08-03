"use client";

import { Button, For, Menu, Portal } from "@chakra-ui/react";
import { useLocale, useTranslations } from "next-intl";
import React, { useTransition } from "react";
import { LOCALES, type Locale } from "~/i18n/config";
import { setUserLocale } from "~/server/locale";

export default function LocaleSwitcher() {
  const currentLocale = useLocale() as Locale;
  const [, startTransition] = useTransition();

  function onSelectLocale(value: string) {
    if (!LOCALES.includes(value as Locale)) {
      console.warn(`Unsupported locale selected: ${value}`);
      return;
    }

    startTransition(async () => {
      await setUserLocale(value as Locale);
    });
  }

  return (
    <Menu.Root onSelect={(e) => onSelectLocale(e.value)}>
      <Menu.Trigger asChild>
        <Button variant="ghost" size="sm">
          <LocaleDisplay locale={currentLocale} />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <For each={LOCALES}>
              {(locale) => (
                <Menu.Item key={locale} value={locale}>
                  <LocaleDisplay locale={locale} />
                </Menu.Item>
              )}
            </For>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

function LocaleDisplay(props: { locale: Locale }) {
  const t = useTranslations("LocaleSwitcher.locales");

  return (
    <>
      {t(`${props.locale}.emoji`)} {t(`${props.locale}.name`)}
    </>
  );
}
