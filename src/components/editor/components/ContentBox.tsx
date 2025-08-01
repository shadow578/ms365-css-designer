import { Box, ButtonGroup, Flex } from "@chakra-ui/react";

export default function ContentBox(props: {
  header: React.ReactNode;
  buttons?: React.ReactNode;
  children: React.ReactNode;
  outline?: boolean;
}) {
  return (
    <Box
      p={2}
      borderWidth={props.outline ? 1 : 0}
      borderRadius={5}
      marginBottom={1}
    >
      <Flex alignItems="center">
        <Box flex={1}>{props.header}</Box>

        {props.buttons && <ButtonGroup>{props.buttons}</ButtonGroup>}
      </Flex>

      {props.children}
    </Box>
  );
}
