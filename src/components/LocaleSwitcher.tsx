"use client";

import { Button } from "@chakra-ui/react";
import { useTransition } from "react";
import { type Locale } from "~/i18n/config";
import { setUserLocale } from "~/server/locale";

export default function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(async () => {
      await setUserLocale(locale);
    });
  }

  return (
    <div className="relative">
      <Button onClick={() => onChange("en")}>EN</Button>
      <Button onClick={() => onChange("de")}>DE</Button>
    </div>
  );
}
