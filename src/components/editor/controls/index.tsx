import type React from "react";
import type {
  CSSPropertyKind,
  CSSPropertyValueTypeByKind,
} from "../properties";
import ColorControl from "./Color";
import SliderControl from "./Slider";

export type PropsFor<T extends CSSPropertyKind> = {
  value: CSSPropertyValueTypeByKind<T>;
  onChange: (value: CSSPropertyValueTypeByKind<T>) => void;
};

export type ComponentFor<T extends CSSPropertyKind> = (
  props: PropsFor<T>,
) => React.JSX.Element;

interface Control<T extends CSSPropertyKind> {
  component: ComponentFor<T>;
}

type ControlRecord = {
  [K in CSSPropertyKind]: Control<K>;
};

const CONTROLS: ControlRecord = {
  color: {
    component: ColorControl,
  },
  percent: {
    component: (props) => (
      <SliderControl
        value={props.value}
        onChange={props.onChange}
        min={0}
        max={100}
        marks={[
          { value: 0, label: "0%" },
          { value: 50, label: "50%" },
          { value: 100, label: "100%" },
        ]}
        valueDisplay={(value) => `${value}%`}
      />
    ),
  },
};
export default CONTROLS;
