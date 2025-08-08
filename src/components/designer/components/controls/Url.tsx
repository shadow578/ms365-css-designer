import { Input } from "@chakra-ui/react";
import type { PropsFor } from ".";
import { useTranslations } from "next-intl";
import React from "react";

const URLSelectionControl = React.memo((props: PropsFor<"url">) => {
  const t = useTranslations("CSSDesigner.controls.URLSelectionControl");

  return (
    <Input
      type="url"
      variant="flushed"
      placeholder={t("input.placeholder")}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
});
URLSelectionControl.displayName = "URLSelectionControl";

export default URLSelectionControl;
