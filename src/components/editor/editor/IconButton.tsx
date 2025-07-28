import { IconButton as ChakraIconButton } from "@chakra-ui/react";
import { Tooltip } from "~/components/ui/tooltip";

export default function IconButton(props: {
  onClick?: () => void;
  label: string;
  color?: Parameters<typeof ChakraIconButton>["0"]["color"];
  children: React.ReactNode;
}) {
  return (
    <Tooltip showArrow content={props.label}>
      <ChakraIconButton
        aria-label={props.label}
        onClick={props.onClick}
        variant="ghost"
        color={props.color}
      >
        {props.children}
      </ChakraIconButton>
    </Tooltip>
  );
}
