import { IconButton as ChakraIconButton } from "@chakra-ui/react";
import React from "react";
import { Tooltip } from "~/components/ui/tooltip";

const IconButton = React.memo(
  (props: {
    onClick?: () => void;
    label: string;
    disabled?: boolean;
    color?: Parameters<typeof ChakraIconButton>["0"]["color"];
    children: React.ReactNode;
  }) => {
    return (
      <Tooltip showArrow content={props.label}>
        <ChakraIconButton
          aria-label={props.label}
          onClick={props.onClick}
          variant="ghost"
          color={props.color}
          disabled={props.disabled}
        >
          {props.children}
        </ChakraIconButton>
      </Tooltip>
    );
  },
);
IconButton.displayName = "IconButton";

export default IconButton;
