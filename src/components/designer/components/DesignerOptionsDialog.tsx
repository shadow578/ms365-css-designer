import React from "react";
import Dialog from "~/components/Dialog";
import { useCSSDesignerMutation } from "../context/mutationContext";
import { Switch, VStack } from "@chakra-ui/react";
import { useCSSDesignerState } from "../context/stateContext";

// TODO i18n
const DesignerOptionsDialog = React.memo(
  (props: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    const [{ options }] = useCSSDesignerState();
    const { mutateOptions } = useCSSDesignerMutation();

    return (
      <Dialog
        open={props.open}
        onOpenChange={props.onOpenChange}
        title="Generator Options"
      >
        <VStack alignItems="start">
          <Switch.Root
            checked={options?.important}
            onCheckedChange={(e) => mutateOptions({ important: e.checked })}
          >
            <Switch.HiddenInput />
            <Switch.Label>Important</Switch.Label>
            <Switch.Control />
          </Switch.Root>
          <Switch.Root
            checked={options?.onlySpecCompliant}
            onCheckedChange={(e) =>
              mutateOptions({ onlySpecCompliant: e.checked })
            }
          >
            <Switch.HiddenInput />
            <Switch.Label>onlySpecCompliant</Switch.Label>
            <Switch.Control />
          </Switch.Root>
        </VStack>
      </Dialog>
    );
  },
);
DesignerOptionsDialog.displayName = "DesignerOptionsDialog";
export default DesignerOptionsDialog;
