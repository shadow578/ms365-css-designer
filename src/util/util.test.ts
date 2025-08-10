import "jest";
import { filterRecord, mapRecord } from "./util";

describe("mapRecord", () => {
  test("transforms record values using provided function", () => {
    const record = { a: 1, b: 2, c: 3 };
    const result = mapRecord(record, (value) => value * 2);
    expect(result).toEqual({ a: 2, b: 4, c: 6 });
  });

  test("more complex transformation", () => {
    const record = { x: "hello", y: "world" };
    const result = mapRecord(record, (value, key) => ({
      label: key,
      display: `value: ${value}`,
    }));

    expect(result).toEqual({
      x: { label: "x", display: "value: hello" },
      y: { label: "y", display: "value: world" },
    });
  });
});

describe("filterRecord", () => {
  test("filters record values based on predicate", () => {
    const record = { a: 1, b: 2, c: 3 };
    const result = filterRecord(record, (value) => value > 1);
    expect(result).toEqual({ b: 2, c: 3 });
  });

  test("returns empty object if no values match predicate", () => {
    const record = { a: 1, b: 2, c: 3 };
    const result = filterRecord(record, (value) => value > 3);
    expect(result).toEqual({});
  });
});
