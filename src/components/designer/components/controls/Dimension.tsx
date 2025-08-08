import {
  Box,
  Flex,
  HStack,
  IconButton,
  InputGroup,
  NumberInput,
  SegmentGroup,
  Slider,
} from "@chakra-ui/react";
import type { PropsFor } from ".";
import { MdAdd, MdOutlineSwipe, MdRemove } from "react-icons/md";
import React, { useMemo } from "react";

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

const DimensionControl = React.memo((props: PropsFor<"dimension">) => {
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
      marks: [0, 50, 100, ...(props.options.negative ? [-50, -100] : [])],
      valueFormatter: (value) => `${value}%`,
    },
  } satisfies Record<typeof props.value.unit, DimensionStyleSettings>;

  const units = useMemo(
    () =>
      (Object.keys(unitConfig) as Array<keyof typeof unitConfig>).filter(
        (u) => props.options.units?.includes(u) ?? true,
      ),
    [props.options.units, unitConfig],
  );
  const currentUnitConfig = unitConfig[props.value.unit];

  const min = props.options.negative ? -currentUnitConfig.max : 0;
  const step = Math.pow(10, -currentUnitConfig.decimals);

  // ensure value has correct number of decimals
  let currentValue =
    Math.round(props.value.value * Math.pow(10, currentUnitConfig.decimals)) /
    Math.pow(10, currentUnitConfig.decimals);

  currentValue = Math.max(min, Math.min(currentValue, currentUnitConfig.max));

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
    <Flex gap={4} alignItems="center" flexWrap="wrap">
      <Box minWidth="300px" flex={1}>
        {currentUnitConfig.style === "slider" ? (
          <Slider.Root
            flex={1}
            value={[currentValue]}
            onValueChange={(e) => onChange({ value: e.value[0] })}
            min={min}
            max={currentUnitConfig.max}
            step={step}
          >
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
            min={min}
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

              <InputGroup
                startElementProps={{ pointerEvents: "auto" }}
                startElement={
                  <NumberInput.Scrubber>
                    <MdOutlineSwipe />
                  </NumberInput.Scrubber>
                }
              >
                <NumberInput.Input />
              </InputGroup>

              <NumberInput.IncrementTrigger asChild>
                <IconButton variant="ghost" size="sm">
                  <MdAdd />
                </IconButton>
              </NumberInput.IncrementTrigger>
            </HStack>
          </NumberInput.Root>
        )}
      </Box>

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
});
DimensionControl.displayName = "DimensionControl";

export default DimensionControl;
