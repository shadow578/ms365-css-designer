import { IconButton as ChakraIconButton } from "@chakra-ui/react";
import React from "react";
import { Tooltip } from "~/components/ui/tooltip";

type ChakraButtonProps = React.ComponentProps<typeof ChakraIconButton>;

const IconButton = React.memo(
  (props: {
    onClick?: () => void;
    label: string;
    disabled?: boolean;
    color?: ChakraButtonProps["color"];
    variant?: ChakraButtonProps["variant"];
    rounded?: ChakraButtonProps["rounded"];
    children: React.ReactNode;
  }) => {
    return (
      <Tooltip showArrow content={props.label}>
        <ChakraIconButton
          aria-label={props.label}
          onClick={props.onClick}
          variant={props.variant ?? "ghost"}
          rounded={props.rounded}
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
