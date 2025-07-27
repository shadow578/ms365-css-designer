import { Slider } from "@chakra-ui/react";

export default function SliderControl(props: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  marks?: Slider.MarksProps["marks"];
  valueDisplay?: "plain" | ((value: number) => string);
}) {
  return (
    <Slider.Root
      value={[props.value]}
      onValueChange={(e) => props.onChange(e.value[0]!)}
      min={props.min}
      max={props.max}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb index={0}>
          {props.valueDisplay && (
            <Slider.DraggingIndicator
              layerStyle="fill.muted"
              bottom="6"
              rounded="sm"
              px="1.5"
            >
              {props.valueDisplay === "plain"
                ? props.value.toString()
                : props.valueDisplay(props.value)}
            </Slider.DraggingIndicator>
          )}
        </Slider.Thumb>
        {props.marks && <Slider.Marks marks={props.marks} />}
      </Slider.Control>
    </Slider.Root>
  );
}
