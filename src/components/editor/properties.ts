import z, { type ZodSchema } from "zod";
import zx from "~/util/zodExtras";

export const PROP_SCHEMA_BY_KIND = {
  color: zx.hexColorRGBA(),
  dimension: z.object({
    value: z.number(),
    unit: z.enum(["px", "em", "rem", "%"]),
  }),
  alignment: z.enum(["left", "right", "center", "justify", "inherit"]),
  fontWeight: z.union([
    z.enum(["bolder", "lighter", "inherit"]),
    z.number().int().min(100).max(900),
  ]),
} satisfies Record<string, ZodSchema>;

export type CSSPropertyKind = keyof typeof PROP_SCHEMA_BY_KIND;

export type CSSPropertyValueTypeByKind<T extends CSSPropertyKind> = z.infer<
  (typeof PROP_SCHEMA_BY_KIND)[T]
>;

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

export type CSSPropertyOptionsForKind<T extends CSSPropertyKind> =
  T extends "color"
    ? ColorProperty
    : T extends "dimension"
      ? DimensionProperty
      : T extends "alignment"
        ? AlignmentProperty
        : T extends "fontWeight"
          ? FontWeightProperty
          : never;

type CSSPropertyKinds =
  | ColorProperty
  | DimensionProperty
  | AlignmentProperty
  | FontWeightProperty;

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
