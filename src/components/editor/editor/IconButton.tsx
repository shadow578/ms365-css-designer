import { IconButton as ChakraIconButton } from "@chakra-ui/react";
import { Tooltip } from "~/components/ui/tooltip";

export default function IconButton(props: {
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip showArrow content={props.label}>
      <ChakraIconButton
        aria-label={props.label}
        onClick={props.onClick}
        variant="ghost"
      >
        {props.children}
      </ChakraIconButton>
    </Tooltip>
  );
}
