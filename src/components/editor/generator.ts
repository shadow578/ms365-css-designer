import type { CSSSelectorPropertyDefinition, CSSStyleDefinition } from ".";
import type {
  CSSPropertyName,
  CSSPropertyValueTypeForProperty,
} from "./properties";
import PROPERTIES, { assertCSSPropertyValue } from "./properties";

function generateCSSProperty<Tprop extends CSSPropertyName>(
  prop: Tprop,
  value: CSSPropertyValueTypeForProperty<Tprop>,
  important: boolean,
) {
  const gen = PROPERTIES[prop].generateCSS as (
    value: CSSPropertyValueTypeForProperty<Tprop>,
  ) => string;

  assertCSSPropertyValue(prop, value);
  return `${prop}: ${gen(value)}${important ? " !important" : ""};`;
}

function generateSelectorCSS(
  selector: string,
  properties: CSSSelectorPropertyDefinition,
  important: boolean,
) {
  const propertieEntries = Object.entries(properties);
  if (propertieEntries.length === 0) {
    return "";
  }

  return `${selector} {
  ${propertieEntries
    .map(([prop, value]) =>
      generateCSSProperty(prop as CSSPropertyName, value, important),
    )
    .join("\n  ")}
}`;
}

export default function generateCSS(
  style: CSSStyleDefinition,
  important = true,
) {
  return (
    Object.entries(style)
      .map(([selector, properties]) =>
        generateSelectorCSS(selector, properties, important),
      )
      .join("\n") + "\n"
  );
}
