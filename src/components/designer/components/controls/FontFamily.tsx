import {
  createListCollection,
  Flex,
  For,
  Portal,
  Select,
} from "@chakra-ui/react";
import type { PropsFor } from ".";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";

const FontFamilyControl = React.memo((props: PropsFor<"fontFamily">) => {
  const t = useTranslations("CSSDesigner.controls.FontFamilyControl");

  const fonts = useMemo(
    () =>
      createListCollection({
        items: FONTS.map((font) => ({
          label: font,
          value: font,
        })),
      }),
    [],
  );

  const onSystemFontSelect = (font: string) => {
    props.onChange(font);
  };

  return (
    <Flex gap={4} alignItems="center" flexWrap="wrap">
      <Select.Root
        flex={1}
        minWidth="300px"
        collection={fonts}
        value={[props.value]}
        onValueChange={(e) => onSystemFontSelect(e.value[0] ?? "")}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder={t("placeholder")} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              <For each={fonts.items}>
                {(fnt) => (
                  <Select.Item
                    item={fnt.value}
                    key={fnt.value}
                    fontFamily={fnt.value}
                  >
                    {fnt.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                )}
              </For>
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Flex>
  );
});
FontFamilyControl.displayName = "FontFamilyControl";

export default FontFamilyControl;

/**
 * fonts available by default in both Windows and macOS
 * see https://learn.microsoft.com/en-us/typography/fonts/windows_10_font_list and https://developer.apple.com/fonts/system-fonts/
 */
const FONTS = [
  "Arial",
  "Arial Black",
  "Comic Sans MS",
  "Courier New",
  "Georgia",
  "Impact",
  "Microsoft Sans Serif",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
];
