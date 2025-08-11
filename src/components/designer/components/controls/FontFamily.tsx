import {
  createListCollection,
  Flex,
  For,
  Input,
  InputGroup,
  Portal,
  Select,
  Switch,
} from "@chakra-ui/react";
import type { PropsFor } from ".";
import { useTranslations } from "next-intl";
import React, { useCallback, useMemo } from "react";
import InfoOnHover from "~/components/InfoOnHover";

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

  const isCustom = useMemo(
    () => !fonts.items.some((f) => f.value === props.value),
    [fonts.items, props.value],
  );

  const onCustomSwitchChange = useCallback(
    (e: Switch.CheckedChangeDetails) => {
      props.onChange(e.checked ? "" : (fonts.items[0]?.value ?? ""));
    },
    [fonts.items, props],
  );

  return (
    <Flex gap={4} alignItems="center" flexWrap="wrap">
      <InputGroup
        flex={1}
        minWidth="300px"
        startAddon={
          <Switch.Root
            checked={isCustom}
            onCheckedChange={onCustomSwitchChange}
          >
            <Switch.HiddenInput />
            <Switch.Label>{t("mode_switch")}</Switch.Label>
            <Switch.Control />
          </Switch.Root>
        }
        endAddon={<InfoOnHover>{t("info")}</InfoOnHover>}
      >
        {isCustom ? (
          <Input
            placeholder={t("placeholder.custom")}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
          />
        ) : (
          <Select.Root
            collection={fonts}
            value={[props.value]}
            onValueChange={(e) => props.onChange(e.value[0] ?? "")}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={t("placeholder.system")} />
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
        )}
      </InputGroup>
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
