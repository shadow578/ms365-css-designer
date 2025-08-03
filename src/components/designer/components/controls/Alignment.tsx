import { SegmentGroup } from "@chakra-ui/react";
import type { PropsFor } from ".";
import { useTranslations } from "next-intl";

export default function AlignmentControl(props: PropsFor<"alignment">) {
  type AlignmentType = typeof props.value;

  const t = useTranslations("CSSDesigner.controls.AlignmentControl");

  // lookup for alignment display names
  // order here is order in the ui
  const alignmentNames = {
    left: t("left"),
    center: t("center"),
    right: t("right"),
    justify: t("justify"),
    inherit: t("inherit"),
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
