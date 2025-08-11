import { HoverCard, Icon, Portal } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import { MdInfoOutline } from "react-icons/md";

export default function InfoOnHover(props: {
  children: React.ReactNode;
  maxWidth?: ComponentProps<typeof HoverCard.Content>["maxWidth"];
}) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Icon>
          <MdInfoOutline />
        </Icon>
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content maxWidth="240px">
            <HoverCard.Arrow />
            {props.children}
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}
