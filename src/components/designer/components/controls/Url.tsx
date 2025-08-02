import { Input } from "@chakra-ui/react";
import type { PropsFor } from ".";

export default function URLSelectionControl(props: PropsFor<"url">) {
  return (
    <Input
      type="url"
      variant="flushed"
      placeholder={props.options.displayName}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
}
