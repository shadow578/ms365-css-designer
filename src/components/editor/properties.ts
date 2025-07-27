import z, { type ZodSchema } from "zod";
import zx from "~/util/zodExtras";

const PROP_SCHEMA_BY_KIND = {
  color: zx.hexColorRGBA(),
  percent: z.number().min(0).max(100),
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
type PercentProperty = CSSBaseProperty<"percent">;

type CSSPropertyKinds = ColorProperty | PercentProperty;

const PROPERTIES = {
  "background-color": {
    kind: "color",
    displayName: "Background Color",
    defaultValue: "#ffffff",
    generateCSS: (value) => `${value}`,
  },
  "border-radius": {
    kind: "percent",
    displayName: "Border Radius",
    defaultValue: 0,
    generateCSS: (value) => `${value}%`,
  },
} satisfies Record<string, CSSPropertyKinds>;
export default PROPERTIES;

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
