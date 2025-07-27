export type CSSPropertyValueTypeByKind<T> = T extends "color"
  ? string
  : T extends "slider"
    ? number
    : never;

interface CSSBaseProperty<T> {
  kind: T;
  displayName: string;
  defaultValue: CSSPropertyValueTypeByKind<T>;

  /**
   * generateCSS only generates the value part of the CSS property.
   * property name and semicolon are handled by the generator.
   */
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
    defaultValue: "#ffffff",
    generateCSS: (value) => `${value}`,
  },
  "border-radius": {
    kind: "slider",
    displayName: "Border Radius",
    defaultValue: 0,
    generateCSS: (value) => `${value}%`,
    options: {
      min: 0,
      max: 100,
    },
  },
} satisfies Record<string, CSSPropertyKinds>;
export default PROPERTIES;

export type CSSPropertyName = keyof typeof PROPERTIES;

export type CSSPropertyKind =
  (typeof PROPERTIES)[keyof typeof PROPERTIES]["kind"];

export type CSSPropertyKindFor<P extends CSSPropertyName> =
  (typeof PROPERTIES)[P]["kind"];

export type CSSPropertyValueTypeForProperty<P extends CSSPropertyName> =
  CSSPropertyValueTypeByKind<(typeof PROPERTIES)[P]["kind"]>;
