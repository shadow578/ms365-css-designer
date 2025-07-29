import type React from "react";
import type {
  CSSPropertyKind,
  CSSPropertyOptionsForKind,
  CSSPropertyValueTypeByKind,
} from "../properties";
import ColorControl from "./Color";
import DimensionControl from "./Dimension";

export type PropsFor<T extends CSSPropertyKind> = {
  options: CSSPropertyOptionsForKind<T>;
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
  dimension: {
    component: DimensionControl,
  },
};
export default CONTROLS;
