"use client";

import { Box, Button, For, Menu, Portal } from "@chakra-ui/react";
import { useLocale, useTranslations } from "next-intl";
import React, { useTransition } from "react";
import { LOCALES, LOCALES_CONFIG, type Locale } from "~/i18n/config";
import { setUserLocale } from "~/server/locale";

import "flag-icons/css/flag-icons.min.css";

export default function LocaleSwitcher(props: {
  style: "full" | "minimal";
  noPortal?: boolean;
}) {
  const currentLocale = useLocale() as Locale;
  const [, startTransition] = useTransition();

  function onSelectLocale(value: string) {
    if (!LOCALES.includes(value as Locale)) {
      console.error(`selected a invalid locale '${value}'`);
      return;
    }

    startTransition(async () => {
      await setUserLocale(value as Locale);
    });
  }

  const PortalW = props.noPortal ? Box : Portal;

  return (
    <Menu.Root onSelect={(e) => onSelectLocale(e.value)}>
      <Menu.Trigger asChild>
        <Button variant="ghost" size="sm">
          <LocaleDisplay
            locale={currentLocale}
            emojiOnly={props.style === "minimal"}
          />
        </Button>
      </Menu.Trigger>
      <PortalW>
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
      </PortalW>
    </Menu.Root>
  );
}

function LocaleDisplay(props: { locale: Locale; emojiOnly?: boolean }) {
  const t = useTranslations("LocaleSwitcher.locales");

  return (
    <>
      <span className={`fi fi-${LOCALES_CONFIG[props.locale].flag}`} />
      {!props.emojiOnly && <span>{t(props.locale)}</span>}
    </>
  );
}
