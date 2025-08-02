import type { CSSStyleDefinition } from "./definitions";
import type {
  CSSPropertyName,
  CSSPropertyValueTypeForProperty,
} from "./definitions/properties";
import PROPERTIES, { validateCSSPropertyValue } from "./definitions/properties";

function generateCSSPropertyValue<Tprop extends CSSPropertyName>(
  prop: Tprop,
  value: CSSPropertyValueTypeForProperty<Tprop>,
): string | undefined {
  const gen = PROPERTIES[prop].generateCSS as (
    value: CSSPropertyValueTypeForProperty<Tprop>,
  ) => string;

  if (!validateCSSPropertyValue(prop, value)) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.warn(`Invalid value for property '${prop}': '${value}'`);
    return undefined;
  }

  return gen(value);
}

type CSSTree = Record<string, Record<string, string>>;

function transformToCssTree(style: CSSStyleDefinition): CSSTree {
  const cssTree: CSSTree = {};

  for (const [selector, properties] of Object.entries(style)) {
    for (const [prop, value] of Object.entries(properties)) {
      if (!prop || !(prop in PROPERTIES) || !value) continue;

      const cssValue = generateCSSPropertyValue(prop as CSSPropertyName, value);
      if (!cssValue) continue;

      // check for selector suffix on property
      // e.g. "color$:hover" should be transformed to "color" with "<selector>:hover" selector
      const split = prop.split("$");
      const baseProp = split[0]!;
      const selectorSuffix = split.slice(1).join("$");
      const fullSelector = `${selector}${selectorSuffix}`;

      cssTree[fullSelector] ??= {};
      cssTree[fullSelector][baseProp] = cssValue;
    }
  }

  return cssTree;
}

function generateCSSFragments(
  style: CSSTree,
  important: boolean,
): { selector: string; content: string }[] {
  return Object.entries(style).map(([selector, properties]) => {
    const props = Object.entries(properties)
      .map(
        ([prop, value]) =>
          `  ${prop}: ${value}${important ? " !important" : ""};`,
      )
      .join("\n");
    return {
      selector,
      content: `{\n${props}\n}`,
    };
  });
}

export default function generateCSS(
  style: CSSStyleDefinition,
  important = true,
) {
  return generateCSSFragments(transformToCssTree(style), important)
    .map(({ selector, content }) => `${selector} ${content}`)
    .join("\n");
}
