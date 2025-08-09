import {
  type Color,
  ColorPicker,
  For,
  Portal,
  SegmentGroup,
  Stack,
  getColorChannels,
  parseColor,
} from "@chakra-ui/react";
import type { PropsFor } from ".";
import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const ColorControl = React.memo((props: PropsFor<"color">) => {
  const formatColor = (color: Color) => {
    if (color.getChannelValuePercent("alpha") === 1) {
      return color.toString("hex");
    }
    return color.toString("hexa");
  };

  const [format, setFormat] = useState<ColorPicker.ColorFormat>("rgba");

  return (
    <ColorPicker.Root
      format={format}
      value={parseColor(props.value)}
      onValueChange={(e) => props.onChange(formatColor(e.value))}
      width="fit-content"
    >
      <ColorPicker.Control>
        <ColorPicker.Input />
        <ColorPicker.Trigger />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <FormatSelect format={format} onFormatChange={setFormat} />

            <ColorPicker.Area />

            <ChannelSliders format="hsla" />
            <ChannelSliders format="hsba" />
            <ChannelSliders format="rgba" />
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
});
ColorControl.displayName = "ColorControl";

export default ColorControl;

const FormatSelect = (props: {
  format: ColorPicker.ColorFormat;
  onFormatChange: (format: ColorPicker.ColorFormat) => void;
}) => {
  const t = useTranslations("CSSDesigner.controls.ColorControl.format");

  const formats = useMemo(() => {
    const f: ColorPicker.ColorFormat[] = ["rgba", "hsla", "hsba"];

    return f.map((format) => ({
      value: format,
      label: t(format),
    }));
  }, [t]);

  return (
    <SegmentGroup.Root
      size="sm"
      justifyContent="space-around"
      value={props.format}
      onValueChange={(e) =>
        props.onFormatChange(e.value as ColorPicker.ColorFormat)
      }
    >
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={formats} />
    </SegmentGroup.Root>
  );
};

const ChannelSliders = (props: { format: ColorPicker.ColorFormat }) => {
  const t = useTranslations("CSSDesigner.controls.ColorControl.slider");

  const channels = getColorChannels(props.format);

  return (
    <ColorPicker.View format={props.format}>
      <For each={channels}>
        {(channel) => (
          <Stack gap="1" key={channel}>
            <ColorPicker.ChannelText minW="5ch">
              {t(channel)}
            </ColorPicker.ChannelText>
            <ColorPicker.ChannelSlider channel={channel} />
          </Stack>
        )}
      </For>
    </ColorPicker.View>
  );
};
