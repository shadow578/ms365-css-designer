import { SegmentGroup } from "@chakra-ui/react";
import type { PropsFor } from ".";

export default function AlignmentControl(props: PropsFor<"alignment">) {
  type AlignmentType = typeof props.value;

  // lookup for alignment display names
  // order here is order in the ui
  const alignmentNames = {
    left: "Left",
    center: "Center",
    right: "Right",
    justify: "Justify",
    inherit: "Inherit",
  } satisfies Record<AlignmentType, string>;

  // remove any alignment that is not allowed
  const selectableAlignments = Object.entries(alignmentNames)
    .filter(
      ([key]) => props.options.allowed?.includes(key as AlignmentType) ?? true,
    )
    .map(([key, name]) => ({
      value: key,
      label: name,
    }));

  return (
    <SegmentGroup.Root
      size="sm"
      value={props.value}
      onValueChange={(e) => props.onChange(e.value as AlignmentType)}
    >
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={selectableAlignments} />
    </SegmentGroup.Root>
  );
}
