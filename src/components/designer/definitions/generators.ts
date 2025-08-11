import type { GeneratorFunction } from "../generator";
import type { CSSPropertyKind } from "./kinds";

type GeneratorRecord = { [K in CSSPropertyKind]: GeneratorFunction<K> };

/**
 * only generates the value part of the CSS property.
 * property name and semicolon are handled by the css generator.
 */
const GENERATOR_BY_KIND = {
  color: (value) => `${value}`,
  dimension: (value) => `${value.value}${value.unit}`,
  alignment: (value) => `${value}`,
  fontWeight: (value) => `${value}`,
  fontFamily: (value) => `'${value}'`,
  url: (value) => `url('${value}')`,
} satisfies GeneratorRecord;
export default GENERATOR_BY_KIND;
