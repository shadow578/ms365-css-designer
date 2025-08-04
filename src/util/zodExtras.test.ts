import "jest";
import zx, { transform } from "./zodExtras";
import z from "zod";

describe("hexColorRGB", () => {
  test("valid RGB hex color", () => {
    expect(zx.hexColorRGB().safeParse("#ff0000").success).toBe(true);
    expect(zx.hexColorRGB().safeParse("#f00").success).toBe(true);
  });

  test("invalid RGB hex color", () => {
    expect(zx.hexColorRGB().safeParse("#ff00").success).toBe(false);
    expect(zx.hexColorRGB().safeParse("#xyz").success).toBe(false);
    expect(zx.hexColorRGB().safeParse("not-a-color").success).toBe(false);
  });

  test("empty string", () => {
    expect(zx.hexColorRGB().safeParse("").success).toBe(false);
  });
});

describe("hexColorRGBA", () => {
  test("valid RGBA hex color", () => {
    expect(zx.hexColorRGBA().safeParse("#ff0000ff").success).toBe(true);
  });

  test("valid RGB hex color", () => {
    expect(zx.hexColorRGBA().safeParse("#f00").success).toBe(true);
    expect(zx.hexColorRGBA().safeParse("#ff0000").success).toBe(true);
  });

  test("invalid RGB hex color", () => {
    expect(zx.hexColorRGBA().safeParse("#ff00").success).toBe(false);
    expect(zx.hexColorRGBA().safeParse("#xyz").success).toBe(false);
    expect(zx.hexColorRGBA().safeParse("not-a-color").success).toBe(false);
  });

  test("empty string", () => {
    expect(zx.hexColorRGBA().safeParse("").success).toBe(false);
  });
});

describe("transform", () => {
  describe("simple schema", () => {
    test("transforms data matching simple schema exactly", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().int().optional(),
      });

      expect(transform(schema, { name: "Alice", age: 30 })).toEqual({
        name: "Alice",
        age: 30,
      });
    });

    test("transforms data matching simple schema with missing props", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().int().optional(),
      });

      expect(transform(schema, { name: "Alice" })).toEqual({
        name: "Alice",
      });
    });

    test("transforms data matching simple schema with invalid props", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().int().optional(),
      });

      expect(transform(schema, { name: "Alice", age: 30.2 })).toEqual({
        name: "Alice",
      });
    });
  });

  describe("nested schema", () => {
    test("transforms data matching nested schema exactly", () => {
      const schema = z.object({
        name: z.string(),
        info: z.object({
          age: z.number().int().optional(),
          city: z.string().optional(),
        }),
      });

      expect(
        transform(schema, { name: "Bob", info: { age: 25, city: "Boston" } }),
      ).toEqual({
        name: "Bob",
        info: { age: 25, city: "Boston" },
      });
    });

    test("transforms data matching nested schema with missing props", () => {
      const schema = z.object({
        name: z.string(),
        info: z.object({
          age: z.number().int().optional(),
          city: z.string().optional(),
        }),
      });

      expect(transform(schema, { name: "Bob", info: { age: 25 } })).toEqual({
        name: "Bob",
        info: { age: 25 },
      });
    });

    test("transforms data matching nested schema with invalid props", () => {
      const schema = z.object({
        name: z.string(),
        info: z.object({
          age: z.number().int().optional(),
          city: z.string().optional(),
        }),
      });

      expect(
        transform(schema, { name: "Bob", info: { age: 25.5, city: "Boston" } }),
      ).toEqual({
        name: "Bob",
        info: { city: "Boston" },
      });
    });

    test("drops nested object if it does not match schema", () => {
      const schema = z.object({
        name: z.string(),
        info: z
          .object({
            age: z.number().int(),
            city: z.string(),
          })
          .optional(),
      });

      expect(transform(schema, { name: "Bob", info: { age: 20.5 } })).toEqual({
        name: "Bob",
      });
    });

    test("transforms data with deep nested schema", () => {
      const schema = z.object({
        user: z.string(),
        details: z
          .object({
            address: z.object({
              street: z.string().optional(),
              city: z.string().optional(),
            }),
          })
          .optional(),
      });

      expect(
        transform(schema, {
          user: "Bob",
          details: {
            address: { street: 123, city: "Springfield" },
          },
        }),
      ).toEqual({
        user: "Bob",
        details: {
          address: { city: "Springfield" },
        },
      });
    });
  });
});
