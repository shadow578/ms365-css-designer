import { type Color, ColorPicker, Portal, parseColor } from "@chakra-ui/react";
import type { PropsFor } from ".";
import React from "react";

const ColorControl = React.memo((props: PropsFor<"color">) => {
  const formatColor = (color: Color) => {
    if (color.getChannelValuePercent("alpha") === 1) {
      return color.toString("hex");
    }
    return color.toString("hexa");
  };

  return (
    <ColorPicker.Root
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
            <ColorPicker.Area />
            <ColorPicker.Sliders />
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
});
ColorControl.displayName = "ColorControl";

export default ColorControl;
