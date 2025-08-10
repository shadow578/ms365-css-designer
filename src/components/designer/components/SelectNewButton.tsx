import { Box, For, Menu, Portal } from "@chakra-ui/react";
import type { SelectionDetails } from "node_modules/@chakra-ui/react/dist/types/components/menu/namespace";
import { useCallback, useMemo } from "react";

export type SelectNewButtonChildren =
  | React.ReactNode
  | ((optionCount: number) => React.ReactNode);

export default function SelectNewButton<T extends string>(props: {
  children: SelectNewButtonChildren;
  options: Record<T, string>;
  onSelect?: (value: T) => void;
}) {
  const onMenuSelect = useCallback(
    (details: SelectionDetails) => {
      const value = details.value;
      if (!(value in props.options)) {
        console.error(`selected invalid value '${value}'`);
        return;
      }

      props.onSelect?.(value as T);
    },
    [props],
  );

  const trigger = useMemo(() => {
    if (typeof props.children === "function") {
      return props.children(Object.keys(props.options).length);
    }
    return props.children;
  }, [props]);

  return (
    <Menu.Root onSelect={onMenuSelect}>
      <Menu.Trigger asChild>
        <Box>{trigger}</Box>
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
