import {
  Box,
  createListCollection,
  Field,
  Flex,
  For,
  Input,
  InputGroup,
  Portal,
  SegmentGroup,
  Select,
} from "@chakra-ui/react";
import type { PropsFor } from ".";
import useFetchStatus from "~/util/useFetchStatus";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";

const FontFamilyControl = React.memo((props: PropsFor<"fontFamily">) => {
  const t = useTranslations("CSSDesigner.controls.FontFamilyControl");

  const systemFonts = useMemo(
    () =>
      createListCollection({
        items: FONTS.map((font) => ({
          label: font,
          value: font,
        })),
      }),
    [],
  );

  const modes = ["system", "external"];
  const modeOptions = modes.map((mode) => ({
    value: mode,
    label: t(`mode.${mode}`),
  }));

  const currentMode = props.value.external ? "external" : "system";

  const onModeChange = (value: string) => {
    props.onChange({
      font: "",
      external: value === "external",
      url: value === "external" ? "" : undefined,
    });
  };

  const onSystemFontSelect = (font: string) => {
    props.onChange({ external: false, font, url: undefined });
  };

  const gFontsHint = "fonts.google.com/specimen/";

  const generateGoogleFontUrl = (family: string) => {
    family = family.trim().replaceAll(" ", "+");

    // TODO: requesting both with and without weights, as some fonts need them to load while others need them missing to load.
    // this is a stupid workaround, but provides better UX than requiring the user to specify this.
    return `https://fonts.googleapis.com/css2?family=${family}&family=${family}:wght@100..900&display=swap`;
  };

  const onExternalFontSelect = (family: string) => {
    props.onChange({
      external: true,
      font: family,
      url: generateGoogleFontUrl(family),
    });
  };

  const { ok: externalFontOk } = useFetchStatus(
    props.value.external ? props.value.url : undefined,
  );

  return (
    <Flex gap={4} alignItems="center" flexWrap="wrap">
      <Box flex={1} minWidth="300px">
        {props.value.external ? (
          <Field.Root invalid={!externalFontOk}>
            <InputGroup flex="1" startElement={gFontsHint}>
              <Input
                ps={`${gFontsHint.length}ch`}
                placeholder={t("placeholder.external")}
                value={props.value.font}
                onChange={(e) => onExternalFontSelect(e.target.value)}
              />
            </InputGroup>
          </Field.Root>
        ) : (
          <Select.Root
            flex={1}
            collection={systemFonts}
            value={[props.value.font]}
            onValueChange={(e) => onSystemFontSelect(e.value[0] ?? "")}
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
                  <For each={systemFonts.items}>
                    {(fnt) => (
                      <Select.Item item={fnt.value} key={fnt.value}>
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
      </Box>

      <SegmentGroup.Root
        size="sm"
        value={currentMode}
        onValueChange={(e) => onModeChange(e.value!)}
      >
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={modeOptions} />
      </SegmentGroup.Root>
    </Flex>
  );
});
FontFamilyControl.displayName = "FontFamilyControl";

export default FontFamilyControl;

/**
 * commonly used fonts available by default in both Windows and macOS
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
