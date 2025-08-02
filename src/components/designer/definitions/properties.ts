import type z from "zod";
import {
  PROP_SCHEMA_BY_KIND,
  type CSSPropertyKind,
  type CSSPropertyValueTypeByKind,
} from "./kinds";
import type { ZodSchema } from "zod";

interface CSSBaseProperty<T extends CSSPropertyKind> {
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
interface DimensionProperty extends CSSBaseProperty<"dimension"> {
  units?: z.infer<(typeof PROP_SCHEMA_BY_KIND)["dimension"]>["unit"][];
  negative?: boolean;
}
interface AlignmentProperty extends CSSBaseProperty<"alignment"> {
  allowed?: z.infer<(typeof PROP_SCHEMA_BY_KIND)["alignment"]>[];
}
type FontWeightProperty = CSSBaseProperty<"fontWeight">;
type URLProperty = CSSBaseProperty<"url">;

export type CSSPropertyOptionsForKind<T extends CSSPropertyKind> =
  T extends "color"
    ? ColorProperty
    : T extends "dimension"
      ? DimensionProperty
      : T extends "alignment"
        ? AlignmentProperty
        : T extends "fontWeight"
          ? FontWeightProperty
          : T extends "url"
            ? URLProperty
            : never;

type CSSPropertyKinds =
  | ColorProperty
  | DimensionProperty
  | AlignmentProperty
  | FontWeightProperty
  | URLProperty;

const PROPERTIES = {
  color: {
    kind: "color",
    displayName: "Color",
    defaultValue: "#000000",
    generateCSS: (value) => `${value}`,
  },
  "background-color": {
    kind: "color",
    displayName: "Background Color",
    defaultValue: "#ffffff",
    generateCSS: (value) => `${value}`,
  },
  "border-radius": {
    kind: "dimension",
    displayName: "Border Radius",
    units: ["px", "%"],
    defaultValue: { value: 0, unit: "px" },
    generateCSS: (value) => `${value.value}${value.unit}`,
  },
  "text-align": {
    kind: "alignment",
    displayName: "Text Alignment",
    defaultValue: "left",
    allowed: ["left", "right", "center"],
    generateCSS: (value) => `${value}`,
  },
  "font-weight": {
    kind: "fontWeight",
    displayName: "Font Weight",
    defaultValue: "inherit",
    generateCSS: (value) => `${value}`,
  },
  "margin-top": {
    kind: "dimension",
    displayName: "Margin Top",
    units: ["px", "em", "rem"],
    negative: true,
    defaultValue: { value: 0, unit: "px" },
    generateCSS: (value) => `${value.value}${value.unit}`,
  },
  "margin-bottom": {
    kind: "dimension",
    displayName: "Margin Bottom",
    units: ["px", "em", "rem"],
    negative: true,
    defaultValue: { value: 0, unit: "px" },
    generateCSS: (value) => `${value.value}${value.unit}`,
  },
  "margin-right": {
    kind: "dimension",
    displayName: "Margin Right",
    units: ["px", "em", "rem"],
    negative: true,
    defaultValue: { value: 0, unit: "px" },
    generateCSS: (value) => `${value.value}${value.unit}`,
  },
  "margin-left": {
    kind: "dimension",
    displayName: "Margin Left",
    units: ["px", "em", "rem"],
    negative: true,
    defaultValue: { value: 0, unit: "px" },
    generateCSS: (value) => `${value.value}${value.unit}`,
  },
  "background-image": {
    kind: "url",
    displayName: "Background Image",
    defaultValue: "",
    generateCSS: (value) => `url("${value}")`,
  },
} satisfies Record<string, CSSPropertyKinds>;
export default PROPERTIES;

export const ALL_PROPERTY_NAMES = Object.keys(PROPERTIES) as CSSPropertyName[];

export type CSSPropertyName = keyof typeof PROPERTIES;

export type CSSPropertyKindFor<P extends CSSPropertyName> =
  (typeof PROPERTIES)[P]["kind"];

export type CSSPropertyValueTypeForProperty<P extends CSSPropertyName> =
  CSSPropertyValueTypeByKind<(typeof PROPERTIES)[P]["kind"]>;

function getSchemaFor(prop: CSSPropertyName): {
  kind: string;
  schema: ZodSchema;
} {
  const kind = PROPERTIES[prop].kind;
  const schema = PROP_SCHEMA_BY_KIND[kind];
  if (!schema) {
    throw new Error(
      `No value schema found for property '${prop}' of kind '${kind}'`,
    );
  }

  return { kind, schema };
}

export function validateCSSPropertyValue<
  Tprop extends CSSPropertyName,
  Tvalue extends CSSPropertyValueTypeForProperty<Tprop>,
>(prop: Tprop, value: unknown): value is Tvalue {
  const { schema } = getSchemaFor(prop);

  return schema.safeParse(value).success;
}

export function assertCSSPropertyValue<
  Tprop extends CSSPropertyName,
  Tvalue extends CSSPropertyValueTypeForProperty<Tprop>,
>(prop: Tprop, value: unknown): asserts value is Tvalue {
  const { kind, schema } = getSchemaFor(prop);

  schema.parse(value, {
    errorMap: () => ({
      message: `Invalid value for property '${prop}' of kind '${kind}'`,
    }),
  });
}
