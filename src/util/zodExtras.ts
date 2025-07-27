import z from "zod";

const SCHEMA = {
  /**
   * zod schema for RGB hex color string.
   */
  hexColorRGB: () =>
    z.string().regex(/^#(?:[0-9A-Fa-f]{6})|(?:[0-9A-Fa-f]{3})$/),

  /**
   * zod schema for RGB or RGBA hex color string.
   */
  hexColorRGBA: () =>
    z
      .string()
      .regex(/^#(?:[0-9A-Fa-f]{8})|(?:[0-9A-Fa-f]{6})|(?:[0-9A-Fa-f]{3})$/),
};
export default SCHEMA;
