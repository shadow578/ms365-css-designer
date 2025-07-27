import type { CSSClassPropertyDefinition, CSSStyleDefinition } from ".";
import type {
  CSSPropertyName,
  CSSPropertyValueTypeForProperty,
} from "./properties";
import PROPERTIES from "./properties";

function generateCSSProperty<Tprop extends CSSPropertyName>(
  prop: Tprop,
  value: CSSPropertyValueTypeForProperty<Tprop>,
) {
  const gen = PROPERTIES[prop].generateCSS as (
    value: CSSPropertyValueTypeForProperty<Tprop>,
  ) => string;
  return gen(value);
}

function generateClassCSS(
  className: string,
  properties: CSSClassPropertyDefinition,
) {
  return `.${className} {
  ${Object.entries(properties)
    .map(([prop, value]) => generateCSSProperty(prop as CSSPropertyName, value))
    .join("\n  ")}
}`;
}

export default function generateCSS(style: CSSStyleDefinition) {
  return (
    Object.entries(style)
      .map(([className, properties]) => {
        return generateClassCSS(className, properties);
      })
      .join("\n") + "\n"
  );
}
