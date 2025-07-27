import { ColorPicker, Portal, parseColor } from "@chakra-ui/react";
import type { PropsFor } from ".";

export default function ColorControl(props: PropsFor<"color">) {
  return (
    <ColorPicker.Root
      value={parseColor(props.value)}
      onValueChange={(e) => props.onChange(e.valueAsString)}
      width="fit-content"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Label>Color</ColorPicker.Label>
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
}
