import { Box, Button, For, Menu, Portal } from "@chakra-ui/react";
import type { SelectionDetails } from "node_modules/@chakra-ui/react/dist/types/components/menu/namespace";

export default function SelectNewButton<T extends string>(props: {
  children: React.ReactNode;
  options: Record<T, string>;
  onSelect?: (value: T) => void;
}) {
  const onMenuSelect = (details: SelectionDetails) => {
    const value = details.value;
    if (!(value in props.options)) {
      console.warn(`Unknown value selected: ${value}`);
      return;
    }

    props.onSelect?.(value as T);
  };

  return (
    <Menu.Root onSelect={onMenuSelect}>
      <Menu.Trigger asChild>
        <Box>
          {props.children}
        </Box>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <For each={Object.entries(props.options as Record<string, string>)}>
              {([value, label]) => (
                <Menu.Item key={value} value={value}>
                  {label}
                </Menu.Item>
              )}
            </For>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
