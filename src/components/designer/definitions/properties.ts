import type z from "zod";
import PROP_SCHEMA_BY_KIND, {
  type CSSPropertyKind,
  type CSSPropertyValueTypeByKind,
} from "./kinds";
import type { ZodSchema } from "zod";

interface CSSBaseProperty<T extends CSSPropertyKind> {
  kind: T;
  defaultValue: CSSPropertyValueTypeByKind<T>;
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
type FontFamilyProperty = CSSBaseProperty<"fontFamily">;
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
          : T extends "fontFamily"
            ? FontFamilyProperty
            : T extends "url"
              ? URLProperty
              : never;

type CSSPropertyKinds =
  | ColorProperty
  | DimensionProperty
  | AlignmentProperty
  | FontWeightProperty
  | FontFamilyProperty
  | URLProperty;

/**
 * a record of all supported CSS properties
 * @note: there is a special case here: properties can also define a suffix for the selector, delimiting the suffic with a '$' character.
 * for example, placing the the 'color$:hover' property on the selector 'button' will generate the following css rule:
 * ```css
 * button:hover {
 *  color: <value>;
 * }
 */
const PROPERTIES = {
  color: {
    kind: "color",
    defaultValue: "#000000",
  },
  "color$:hover": {
    kind: "color",
    defaultValue: "#000000",
  },
  "background-color": {
    kind: "color",
    defaultValue: "#ffffff",
  },
  "background-color$:hover": {
    kind: "color",
    defaultValue: "#ffffff",
  },
  "border-radius": {
    kind: "dimension",
    units: ["px", "%"],
    defaultValue: { value: 0, unit: "px" },
  },
  "text-align": {
    kind: "alignment",
    defaultValue: "left",
    allowed: ["left", "right", "center"],
  },
  "font-weight": {
    kind: "fontWeight",
    defaultValue: "inherit",
  },
  "font-family": {
    kind: "fontFamily",
    defaultValue: { external: false, font: "" },
  },
  "font-size": {
    kind: "dimension",
    units: ["px", "em", "rem"],
    defaultValue: { value: 16, unit: "px" },
  },
  "margin-top": {
    kind: "dimension",
    units: ["px", "em", "rem"],
    negative: true,
    defaultValue: { value: 0, unit: "px" },
  },
  "margin-bottom": {
    kind: "dimension",
    units: ["px", "em", "rem"],
    negative: true,
    defaultValue: { value: 0, unit: "px" },
  },
  "margin-right": {
    kind: "dimension",
    units: ["px", "em", "rem"],
    negative: true,
    defaultValue: { value: 0, unit: "px" },
  },
  "margin-left": {
    kind: "dimension",
    units: ["px", "em", "rem"],
    negative: true,
    defaultValue: { value: 0, unit: "px" },
  },
  "background-image": {
    kind: "url",
    defaultValue: "",
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
    error: () => ({
      message: `Invalid value for property '${prop}' of kind '${kind}'`,
    }),
  });
}
