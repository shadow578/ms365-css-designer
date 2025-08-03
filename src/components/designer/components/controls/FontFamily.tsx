import { Input } from "@chakra-ui/react";
import type { PropsFor } from ".";

export default function FontFamilyControl(props: PropsFor<"fontFamily">) {
  return (
    <Input
      type="text"
      variant="flushed"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
}
