import { SegmentGroup } from "@chakra-ui/react";
import type { PropsFor } from ".";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";

const AlignmentControl = React.memo((props: PropsFor<"alignment">) => {
  type AlignmentType = typeof props.value;

  const t = useTranslations("CSSDesigner.controls.AlignmentControl");

  const selectableAlignments = useMemo(() => {
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
    return Object.entries(alignmentNames)
      .filter(
        ([key]) =>
          props.options.allowed?.includes(key as AlignmentType) ?? true,
      )
      .map(([key, name]) => ({
        value: key,
        label: name,
      }));
  }, [t, props.options.allowed]);

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
});
AlignmentControl.displayName = "AlignmentControl";

export default AlignmentControl;
