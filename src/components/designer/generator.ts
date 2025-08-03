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

interface ImportItem {
  id: string;
  url: string;
}

type StyleTree = Record<string, Record<string, string>>;

export type Context = {
  imports: ImportItem[];
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
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.warn(`Invalid value for property '${prop}': '${value}'`);
    return undefined;
  }

  const kind = PROPERTIES[prop].kind;
  const gen = GENERATOR_BY_KIND[kind] as GeneratorFunction<
    CSSPropertyKindFor<Tprop>
  >;
  return gen(value, context);
}

function transformToContext(style: CSSStyleDefinition): Context {
  const context: Context = {
    imports: [],
    style: {},
  };

  for (const [selector, properties] of Object.entries(style)) {
    for (const [prop, value] of Object.entries(properties)) {
      if (!prop || !(prop in PROPERTIES) || !value) continue;

      const cssValue = generateCSSPropertyValue(
        prop as CSSPropertyName,
        value,
        context,
      );
      if (!cssValue) continue;

      // check for selector suffix on property
      // e.g. "color$:hover" should be transformed to "color" with "<selector>:hover" selector
      const split = prop.split("$");
      const baseProp = split[0]!;
      const selectorSuffix = split.slice(1).join("$");
      const fullSelector = `${selector}${selectorSuffix}`;

      context.style[fullSelector] ??= {};
      context.style[fullSelector][baseProp] = cssValue;
    }
  }

  return context;
}

function generateImportFragments(imports: ImportItem[]): string[] {
  // remove duplicates
  const uniqueImports = new Map<string, ImportItem>();
  for (const item of imports) {
    if (!uniqueImports.has(item.url)) {
      uniqueImports.set(item.url, item);
    }
  }

  return [...uniqueImports.values()].map(
    (i) => `/*${i.id}*/\n@import url('${i.url}');`,
  );
}

function generateStyleFragment(style: StyleTree, important: boolean): string[] {
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

export default function generateCSS(
  style: CSSStyleDefinition,
  important = true,
) {
  const context = transformToContext(style);

  const imports = generateImportFragments(context.imports).join("\n");
  const styles = generateStyleFragment(context.style, important).join("\n");

  return [imports, styles].join("\n\n");
}
