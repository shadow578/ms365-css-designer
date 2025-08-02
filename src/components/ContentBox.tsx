import { Box, ButtonGroup, Collapsible, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

interface ContentBoxBaseProps {
  header: React.ReactNode;
  buttons?: React.ReactNode;
  children: React.ReactNode;
  outline?: boolean;
}

type BoxProps = Omit<
  React.ComponentProps<typeof Box>,
  "children" | "direction"
>;

export default function ContentBox(
  props: ContentBoxBaseProps & {
    height?: BoxProps["height"];
    collapsible?: boolean;
  },
) {
  const propsForward = {
    header: props.header,
    buttons: props.buttons,
    outline: props.outline,
    children: props.children,
    box: {
      p: 2,
      borderWidth: props.outline ? 1 : 0,
      borderRadius: 5,
      marginBottom: 1,
      height: props.height,
    },
  };

  return props.collapsible ? (
    <CollapsibleBox {...propsForward} />
  ) : (
    <NormalBox {...propsForward} />
  );
}

function NormalBox(props: ContentBoxBaseProps & { box: BoxProps }) {
  return (
    <Flex {...props.box} direction="column">
      <Flex alignItems="center">
        <Box flex={1} textAlign="start">
          {props.header}
        </Box>

        {props.buttons && <ButtonGroup>{props.buttons}</ButtonGroup>}
      </Flex>

      {props.children}
    </Flex>
  );
}

function CollapsibleBox(props: ContentBoxBaseProps & { box: BoxProps }) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible.Root
      {...props.box}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Flex alignItems="center">
        <Collapsible.Trigger flex={1} asChild>
          <Flex alignItems="center" textAlign="start" gap={2}>
            {open ? <MdExpandLess /> : <MdExpandMore />}

            {props.header}
          </Flex>
        </Collapsible.Trigger>

        {props.buttons && <ButtonGroup>{props.buttons}</ButtonGroup>}
      </Flex>

      <Collapsible.Content>{props.children}</Collapsible.Content>
    </Collapsible.Root>
  );
}
