import React from "react";
import Dialog from "~/components/Dialog";
import { useCSSDesignerMutation } from "../context/mutationContext";
import { Text, Box, Switch, VStack } from "@chakra-ui/react";
import { useCSSDesignerState } from "../context/stateContext";
import { useTranslations } from "next-intl";

// TODO i18n
const DesignerOptionsDialog = React.memo(
  (props: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    const [{ options }] = useCSSDesignerState();
    const { mutateOptions } = useCSSDesignerMutation();

    const t = useTranslations("DesignerOptionsDialog");

    return (
      <Dialog
        open={props.open}
        onOpenChange={props.onOpenChange}
        title={t("title")}
      >
        <VStack alignItems="start" gap={4}>
          <OptionSwitch
            translationKey="important"
            checked={!!options?.important}
            onChange={(e) => mutateOptions({ important: e })}
          />

          <OptionSwitch
            translationKey="onlySpecCompliant"
            checked={!!options?.onlySpecCompliant}
            onChange={(e) => mutateOptions({ onlySpecCompliant: e })}
          />

          <OptionSwitch
            translationKey="includeAdditionalSelectors"
            checked={!!options?.includeAdditionalSelectors}
            onChange={(e) => mutateOptions({ includeAdditionalSelectors: e })}
          />
        </VStack>
      </Dialog>
    );
  },
);
DesignerOptionsDialog.displayName = "DesignerOptionsDialog";

export default DesignerOptionsDialog;

function OptionSwitch(props: {
  translationKey: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const t = useTranslations(
    `DesignerOptionsDialog.options.${props.translationKey}`,
  );

  return (
    <Box>
      <Switch.Root
        checked={props.checked}
        onCheckedChange={(e) => props.onChange(e.checked)}
      >
        <Switch.HiddenInput />
        <Switch.Label>{t("label")}</Switch.Label>
        <Switch.Control />
      </Switch.Root>
      <Text textStyle="sm">{t("help")}</Text>
    </Box>
  );
}
