import {
  Flex,
  HStack,
  IconButton,
  NumberInput,
  SegmentGroup,
  Slider,
} from "@chakra-ui/react";
import type { PropsFor } from ".";
import { MdAdd, MdRemove } from "react-icons/md";

interface DimensionCommonSettings {
  max: number;
  decimals: number;
}

interface DimensionInputStyleSettings extends DimensionCommonSettings {
  style: "input";
}

interface DimensionSliderStyleSettings extends DimensionCommonSettings {
  style: "slider";
  marks?: number[];
  valueFormatter?: (value: number) => string;
}

type DimensionStyleSettings =
  | DimensionInputStyleSettings
  | DimensionSliderStyleSettings;

export default function DimensionControl(props: PropsFor<"dimension">) {
  const unitConfig = {
    px: {
      style: "input",
      max: 100,
      decimals: 0, // 1.0
    },
    em: {
      max: 10,
      decimals: 1, // 0.1
      style: "input",
    },
    rem: {
      max: 10,
      decimals: 1, // 0.1
      style: "input",
    },
    "%": {
      max: 100,
      decimals: 0, // 1.0
      style: "slider",
      marks: [0, 50, 100],
      valueFormatter: (value) => `${value}%`,
    },
  } satisfies Record<typeof props.value.unit, DimensionStyleSettings>;
  const units = Object.keys(unitConfig) as Array<keyof typeof unitConfig>;
  const currentUnitConfig = unitConfig[props.value.unit];

  const step = Math.pow(10, -currentUnitConfig.decimals);

  // ensure value has correct number of decimals
  const currentValue =
    Math.round(props.value.value * Math.pow(10, currentUnitConfig.decimals)) /
    Math.pow(10, currentUnitConfig.decimals);

  const onChange = (changed: {
    value?: number;
    unit?: keyof typeof unitConfig;
  }) => {
    props.onChange({
      value: changed.value ?? currentValue,
      unit: changed.unit ?? props.value.unit,
    });
  };

  return (
    <Flex gap={4} alignItems="center">
      {currentUnitConfig.style === "slider" ? (
        <Slider.Root
          flex={1}
          value={[currentValue]}
          onValueChange={(e) => onChange({ value: e.value[0] })}
          min={0}
          max={currentUnitConfig.max}
          step={step}
        >
          <Slider.Label>{props.label}</Slider.Label>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0}>
              {currentUnitConfig.valueFormatter && (
                <Slider.DraggingIndicator
                  layerStyle="fill.muted"
                  bottom="6"
                  rounded="sm"
                  px="1.5"
                >
                  {currentUnitConfig.valueFormatter(currentValue)}
                </Slider.DraggingIndicator>
              )}
            </Slider.Thumb>
            {currentUnitConfig.marks && (
              <Slider.Marks
                marks={currentUnitConfig.marks.map((m) => ({
                  value: m,
                  label: currentUnitConfig.valueFormatter?.(m) ?? m,
                }))}
              />
            )}
          </Slider.Control>
        </Slider.Root>
      ) : (
        <NumberInput.Root
          flex={1}
          value={currentValue.toString()}
          onValueChange={(e) => onChange({ value: e.valueAsNumber })}
          min={0}
          max={currentUnitConfig.max}
          step={step}
          allowMouseWheel
        >
          <HStack gap={2}>
            <NumberInput.DecrementTrigger asChild>
              <IconButton variant="ghost" size="sm">
                <MdRemove />
              </IconButton>
            </NumberInput.DecrementTrigger>

            <NumberInput.Input />

            <NumberInput.IncrementTrigger asChild>
              <IconButton variant="ghost" size="sm">
                <MdAdd />
              </IconButton>
            </NumberInput.IncrementTrigger>
          </HStack>
        </NumberInput.Root>
      )}

      <SegmentGroup.Root
        size="sm"
        value={props.value.unit}
        onValueChange={(e) =>
          onChange({
            unit: e.value as keyof typeof unitConfig,
          })
        }
      >
        <SegmentGroup.Indicator />
        <SegmentGroup.Items items={units} />
      </SegmentGroup.Root>
    </Flex>
  );
}
