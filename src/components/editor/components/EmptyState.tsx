import { Center, HStack, Icon } from "@chakra-ui/react";
import { MdOutlineDeselect } from "react-icons/md";

export default function EmptyState(props: { children: React.ReactNode }) {
  return (
    <Center>
      <HStack textAlign="center">
        <Icon size="lg">
          <MdOutlineDeselect />
        </Icon>
        {props.children}
      </HStack>
    </Center>
  );
}
