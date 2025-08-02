import { Flex, SegmentGroup, Slider } from "@chakra-ui/react";
import type { PropsFor } from ".";

export default function FontWeightControl(props: PropsFor<"fontWeight">) {
  const selectedWeightOption =
    typeof props.value === "number" ? "absolute" : props.value;

  type SelectOptions = typeof selectedWeightOption;

  // lookup for named weight display
  // order here is order in the ui
  const weightOptions = {
    absolute: "Absolute",
    bolder: "Bolder",
    lighter: "Lighter",
    inherit: "Inherit",
  } satisfies Record<SelectOptions, string>;

  const selectableWeightOptions = Object.entries(weightOptions).map(
    ([key, name]) => ({
      value: key,
      label: name,
    }),
  );

  // names for the absolute weights, selected by the slider
  const namedAbsoluteWeights = {
    100: "Thin",
    200: "Extra Light",
    300: "Light",
    400: "Normal",
    500: "Medium",
    600: "Semi Bold",
    700: "Bold",
    800: "Extra Bold",
    900: "Black",
  };

  const sliderValueFormatter = (w: number) => {
    if (w in namedAbsoluteWeights) {
      return namedAbsoluteWeights[w as keyof typeof namedAbsoluteWeights];
    }

    return w.toString();
  };

  const marks = Object.entries(namedAbsoluteWeights).map(([w, _]) => Number(w));

  const onSelectWeightOption = (value: SelectOptions) => {
    if (value === "absolute") {
      // If "absolute" is selected, slider takes over
      props.onChange(400);
    } else {
      props.onChange(value);
    }
  };

  return (
    <Flex gap={4} alignItems="center">
      <Slider.Root
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
}
