import { ButtonGroup, EmptyState, VStack } from "@chakra-ui/react";
import type React from "react";
import { MdOutlineStyle } from "react-icons/md";

export default function DesignerEmptyState(props: {
  title: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <EmptyState.Root size="sm">
      <EmptyState.Content>
        <EmptyState.Indicator>
          <MdOutlineStyle />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>{props.title}</EmptyState.Title>
        </VStack>
        <ButtonGroup>{props.action}</ButtonGroup>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
