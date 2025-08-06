import z, {
  ZodObject,
  ZodOptional,
  type ZodSchema,
  type ZodRawShape,
} from "zod";

const SCHEMA = {
  /**
   * zod schema for RGB hex color string.
   */
  hexColorRGB: () =>
    z.string().regex(/^#(?:(?:[0-9A-Fa-f]{6})|(?:[0-9A-Fa-f]{3}))$/),

  /**
   * zod schema for RGB or RGBA hex color string.
   */
  hexColorRGBA: () =>
    z
      .string()
      .regex(/^#(?:(?:[0-9A-Fa-f]{8})|(?:[0-9A-Fa-f]{6})|(?:[0-9A-Fa-f]{3}))$/),
};
export default SCHEMA;

/**
 * transforms a given object such that it matches the given zod schema, removing non-matching properties.
 *
 * @param schema the zod schema to validate against
 * @param data the data to transform
 * @returns the transformed data if it matches the schema, or undefined if it does not match
 */
export function transform<T extends ZodRawShape>(
  schema: ZodObject<T>,
  data: unknown,
): z.infer<ZodObject<T>> | undefined {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }

  let result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  data = Object.fromEntries(
    Object.entries(data)
      .map(([key, value]) => {
        let expectedType = schema.shape[key];
        if (!expectedType) {
          return [key, undefined];
        }

        if (expectedType instanceof ZodOptional) {
          expectedType = expectedType.unwrap() as ZodSchema;
        }

        if (expectedType instanceof ZodObject) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- FIXME wonky
          value = transform(expectedType, value);
        }

        const r = expectedType.safeParse(value);
        return r.success ? [key, r.data as unknown] : [key, undefined];
      })
      .filter(([, value]) => value !== undefined),
  ) as unknown;

  result = schema.safeParse(data);
  return result.success ? result.data : undefined;
}
