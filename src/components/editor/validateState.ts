import type { CSSSelectorPropertyDefinition } from ".";
import type { EditorState } from "./context";
import PROPERTIES, {
  ALL_PROPERTY_NAMES,
  PROP_SCHEMA_BY_KIND,
  type CSSPropertyKindFor,
  type CSSPropertyName,
  type CSSPropertyValueTypeByKind,
} from "./properties";
import { ALL_SELECTORS } from "./selectors";

function isValidStyleRecord(
  unknownStyle: unknown,
): unknownStyle is Record<string, Record<string, unknown>> {
  if (typeof unknownStyle !== "object" || unknownStyle === null) {
    return false;
  }

  return Object.entries(unknownStyle).every(
    ([key, value]) =>
      typeof key === "string" &&
      typeof value === "object" &&
      value !== null &&
      Object.keys(value as object).every((prop) => typeof prop === "string"),
  );
}

function isValidPropertyValue<Tprop extends CSSPropertyName>(
  prop: Tprop,
  unknownPropValue: unknown,
): unknownPropValue is CSSPropertyValueTypeByKind<CSSPropertyKindFor<Tprop>> {
  const propDefinition = PROPERTIES[prop];
  if (!propDefinition) return false;

  const valueSchema = PROP_SCHEMA_BY_KIND[propDefinition.kind];
  if (!valueSchema) return false;

  return valueSchema.safeParse(unknownPropValue).success;
}

export default function validateState(state: unknown): EditorState | undefined {
  // must be object
  if (!state || typeof state !== "object") {
    return undefined;
  }

  // style object must be Record<string, unknown>
  if (!("style" in state) || !isValidStyleRecord(state.style)) {
    return undefined;
  }

  const parsedState: EditorState = { style: {} };

  // copy over all selectors
  for (const sel of ALL_SELECTORS) {
    if (sel in state.style) {
      const properties = state.style[sel];
      if (!properties) continue;

      const selectorProperties: CSSSelectorPropertyDefinition = {};
      let hasValidProperties = false;

      for (const prop of ALL_PROPERTY_NAMES) {
        if (prop in properties) {
          const propValue = properties[prop];

          if (isValidPropertyValue(prop, propValue)) {
            hasValidProperties = true;

            // @ts-expect-error -- FIXME wonky types here
            selectorProperties[prop] = propValue;
          }
        }
      }

      if (hasValidProperties) {
        // @ts-expect-error -- FIXME wonky types here
        parsedState.style[sel] = selectorProperties;
      }
    }
  }

  return parsedState;
}
