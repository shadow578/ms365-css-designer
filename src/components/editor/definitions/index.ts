import { type CSSSelectorName } from "./selectors";
import type {
  CSSPropertyName,
  CSSPropertyValueTypeForProperty,
} from "./properties";

export type CSSSelectorPropertyDefinition = {
  [K in CSSPropertyName]?: CSSPropertyValueTypeForProperty<K>;
};

export type CSSStyleDefinition = Partial<
  Record<CSSSelectorName, CSSSelectorPropertyDefinition>
>;
