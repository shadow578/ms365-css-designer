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
  slider: {
    component: SliderControl,
  },
};
export default CONTROLS;
