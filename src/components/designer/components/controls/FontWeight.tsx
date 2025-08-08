import { Flex, SegmentGroup, Slider } from "@chakra-ui/react";
import type { PropsFor } from ".";
import { useTranslations } from "next-intl";
import React, { useCallback, useMemo } from "react";

const FontWeightControl = React.memo((props: PropsFor<"fontWeight">) => {
  const selectedWeightOption =
    typeof props.value === "number" ? "absolute" : props.value;

  type SelectOptions = typeof selectedWeightOption;

  const t = useTranslations("CSSDesigner.controls.FontWeightControl");

  const selectableWeightOptions = useMemo(() => {
    // lookup for named weight display
    // order here is order in the ui
    const weightOptions = {
      absolute: t("absolute"),
      bolder: t("bolder"),
      lighter: t("lighter"),
      inherit: t("inherit"),
    } satisfies Record<SelectOptions, string>;

    return Object.entries(weightOptions).map(([key, name]) => ({
      value: key,
      label: name,
    }));
  }, [t]);

  // names for the absolute weights, selected by the slider
  const namedAbsoluteWeights = useMemo(
    () => ({
      100: t("thin"),
      200: t("extra_light"),
      300: t("light"),
      400: t("normal"),
      500: t("medium"),
      600: t("semi_bold"),
      700: t("bold"),
      800: t("extra_bold"),
      900: t("black"),
    }),
    [t],
  );

  const sliderValueFormatter = (w: number) => {
    if (w in namedAbsoluteWeights) {
      return namedAbsoluteWeights[w as keyof typeof namedAbsoluteWeights];
    }

    return w.toString();
  };

  const marks = useMemo(
    () => Object.entries(namedAbsoluteWeights).map(([w, _]) => Number(w)),
    [namedAbsoluteWeights],
  );

  const onSelectWeightOption = useCallback(
    (value: SelectOptions) => {
      if (value === "absolute") {
        // If "absolute" is selected, slider takes over
        props.onChange(400);
      } else {
        props.onChange(value);
      }
    },
    [props],
  );

  return (
    <Flex gap={4} alignItems="center" flexWrap="wrap">
      <Slider.Root
        minWidth="300px"
        disabled={selectedWeightOption !== "absolute"}
        flex={1}
        value={[typeof props.value === "number" ? props.value : 0]}
        onValueChange={(e) => props.onChange(e.value[0]!)}
        min={100}
        max={900}
        step={100}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0}>
            <Slider.DraggingIndicator
              layerStyle="fill.muted"
              bottom="6"
              rounded="sm"
              px="1.5"
              textWrap="nowrap"
            >
              {typeof props.value === "number" &&
                sliderValueFormatter(props.value)}
            </Slider.DraggingIndicator>
          </Slider.Thumb>
          <Slider.Marks marks={marks} />
        </Slider.Control>
      </Slider.Root>

      <SegmentGroup.Root
        size="sm"
        value={selectedWeightOption}
        onValueChange={(e) => onSelectWeightOption(e.value as SelectOptions)}
      >
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={selectableWeightOptions} />
      </SegmentGroup.Root>
    </Flex>
  );
});
FontWeightControl.displayName = "FontWeightControl";

export default FontWeightControl;
