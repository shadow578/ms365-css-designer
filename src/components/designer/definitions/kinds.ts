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
  url: z.string()
} satisfies Record<string, ZodSchema>;

export type CSSPropertyKind = keyof typeof PROP_SCHEMA_BY_KIND;

export type CSSPropertyValueTypeByKind<T extends CSSPropertyKind> = z.infer<
  (typeof PROP_SCHEMA_BY_KIND)[T]
>;
