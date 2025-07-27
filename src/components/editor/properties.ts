export type CSSPropertyValueTypeByKind<T> = T extends "color"
  ? string
  : T extends "slider"
    ? number
    : never;

interface CSSBaseProperty<T> {
  kind: T;
  displayName: string;
  generateCSS: (value: CSSPropertyValueTypeByKind<T>) => string;
}

type ColorProperty = CSSBaseProperty<"color">;

interface SliderProperty extends CSSBaseProperty<"slider"> {
  options: {
    min: number;
    max: number;
  };
}

type CSSPropertyKinds = ColorProperty | SliderProperty;

const PROPERTIES = {
  "background-color": {
    kind: "color",
    displayName: "Background Color",
    generateCSS: (value) => `background-color: ${value};`,
  },
  "border-radius": {
    kind: "slider",
    displayName: "Border Radius",
    generateCSS: (value) => `border-radius: ${value}%;`,
    options: {
      min: 0,
      max: 100,
    },
  },
} satisfies Record<string, CSSPropertyKinds>;
export default PROPERTIES;

export type CSSProperties = keyof typeof PROPERTIES;

export type CSSPropertyKind =
  (typeof PROPERTIES)[keyof typeof PROPERTIES]["kind"];

export type CSSPropertyValueTypeForProperty<P extends CSSProperties> =
  CSSPropertyValueTypeByKind<(typeof PROPERTIES)[P]["kind"]>;
