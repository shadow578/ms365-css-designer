import {
  Button,
  CloseButton,
  Dialog as ChakraDialog,
  Portal,
} from "@chakra-ui/react";

export default function Dialog(props: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  noDismiss?: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  primary?: string;
  primaryProps?: React.ComponentProps<typeof Button>;
  onPrimary?: () => void;
  secondary?: string;
  secondaryProps?: React.ComponentProps<typeof Button>;
  onSecondary?: () => void;
}) {
  return (
    <ChakraDialog.Root
      placement="center"
      motionPreset="slide-in-bottom"
      open={props.open}
      onOpenChange={(e) => props.onOpenChange?.(e.open)}
      lazyMount
    >
      <Portal>
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner>
          <ChakraDialog.Content>
            <ChakraDialog.Header>
              <ChakraDialog.Title>{props.title}</ChakraDialog.Title>
            </ChakraDialog.Header>
            <ChakraDialog.Body>{props.children}</ChakraDialog.Body>
            <ChakraDialog.Footer>
              {props.secondary && (
                <ChakraDialog.ActionTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={props.onSecondary}
                    {...props.secondaryProps}
                  >
                    {props.secondary}
                  </Button>
                </ChakraDialog.ActionTrigger>
              )}
              {props.primary && (
                <Button onClick={props.onPrimary} {...props.primaryProps}>
                  {props.primary}
                </Button>
              )}
            </ChakraDialog.Footer>
            {!props.noDismiss && (
              <ChakraDialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </ChakraDialog.CloseTrigger>
            )}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
  );
}
