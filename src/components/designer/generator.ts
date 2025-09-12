import type { CSSStyleDefinition } from "./definitions";
import GENERATOR_BY_KIND from "./definitions/generators";
import type {
  CSSPropertyKind,
  CSSPropertyValueTypeByKind,
} from "./definitions/kinds";
import type {
  CSSPropertyKindFor,
  CSSPropertyName,
  CSSPropertyValueTypeForProperty,
} from "./definitions/properties";
import PROPERTIES, { validateCSSPropertyValue } from "./definitions/properties";
import SELECTORS, {
  type CSSSelector,
  type CSSSelectorName,
} from "./definitions/selectors";

type StyleTree = Record<string, Record<string, string>>;

export type Context = {
  style: StyleTree;
};

export type GeneratorFunction<Tkind extends CSSPropertyKind> = (
  value: CSSPropertyValueTypeByKind<Tkind>,
  context: Context,
) => string;

function generateCSSPropertyValue<Tprop extends CSSPropertyName>(
  prop: Tprop,
  value: CSSPropertyValueTypeForProperty<Tprop>,
  context: Context,
): string | undefined {
  if (!validateCSSPropertyValue(prop, value)) {
    // NOTE: due to validateCSSPropertyValue, for typescript 'value' cannot be in this branch.
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.error(`property '${prop}' has invalid value: '${value}'`);
    return undefined;
  }

  const kind = PROPERTIES[prop].kind;
  const gen = GENERATOR_BY_KIND[kind] as GeneratorFunction<
    CSSPropertyKindFor<Tprop>
  >;
  return gen(value, context);
}

function transformToContext(
  style: CSSStyleDefinition,
  includeAdditionalSelectors: boolean,
): Context {
  const context: Context = {
    style: {},
  };

  for (const [selector, properties] of Object.entries(style)) {
    if (!selector || !(selector in SELECTORS)) continue;
    const selectorDef: CSSSelector = SELECTORS[selector as CSSSelectorName];

    for (const [prop, value] of Object.entries(properties)) {
      if (!prop || !(prop in PROPERTIES) || !value) continue;

      const cssValue = generateCSSPropertyValue(
        prop as CSSPropertyName,
        value,
        context,
      );
      if (!cssValue) continue;

      // collect all selectors we need for this rule (additional selectors)
      // selectors are transformed later to their full names
      let selectors = [selector];
      if (includeAdditionalSelectors && selectorDef.additionalSelectors) {
        for (const additionalSelector of selectorDef.additionalSelectors) {
          selectors.push(additionalSelector);
        }
      }

      // check for selector suffix on property
      // e.g. "color$:hover" should be transformed to "color" with "<selector>:hover" selector
      const split = prop.split("$");
      const baseProp = split[0]!;
      const selectorSuffix = split.slice(1).join("$");

      // transform all selectors to their full names
      selectors = selectors.map((s) => `${s}${selectorSuffix}`);

      // generate rule
      const rule = selectors.join(", ");
      context.style[rule] ??= {};
      context.style[rule][baseProp] = cssValue;
    }
  }

  return context;
}

function generateStyleRules(style: StyleTree, important: boolean): string[] {
  return Object.entries(style).map(([selector, properties]) => {
    const props = Object.entries(properties)
      .map(
        ([prop, value]) =>
          `  ${prop}: ${value}${important ? " !important" : ""};`,
      )
      .join("\n");
    return `${selector} {\n${props}\n}`;
  });
}

export interface GenerateCSSOptions {
  /**
   * mark all properties as !important
   */
  important?: boolean;

  /**
   * include additional selectors (as defined in CSSSelector interface) to improve compatibility
   */
  includeAdditionalSelectors?: boolean;
}

export default function generateCSS(
  style: CSSStyleDefinition,
  options: GenerateCSSOptions = {},
) {
  const context = transformToContext(
    style,
    !!options.includeAdditionalSelectors,
  );

  return generateStyleRules(context.style, !!options.important).join("\n");
}
