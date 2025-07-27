import type { CSSClassPropertyDefinition, CSSStyleDefinition } from ".";
import type {
  CSSPropertyName,
  CSSPropertyValueTypeForProperty,
} from "./properties";
import PROPERTIES from "./properties";

function generateCSSProperty<Tprop extends CSSPropertyName>(
  prop: Tprop,
  value: CSSPropertyValueTypeForProperty<Tprop>,
  important: boolean,
) {
  const gen = PROPERTIES[prop].generateCSS as (
    value: CSSPropertyValueTypeForProperty<Tprop>,
  ) => string;
  return `${prop}: ${gen(value)}${important ? " !important" : ""};`;
}

function generateClassCSS(
  className: string,
  properties: CSSClassPropertyDefinition,
  important: boolean,
) {
  const propertieEntries = Object.entries(properties);
  if (propertieEntries.length === 0) {
    return "";
  }

  return `.${className} {
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
      .map(([className, properties]) =>
        generateClassCSS(className, properties, important),
      )
      .join("\n") + "\n"
  );
}
