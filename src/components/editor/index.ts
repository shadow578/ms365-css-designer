import { type CSSClassName } from "./classes";
import type {
  CSSPropertyName,
  CSSPropertyValueTypeForProperty,
} from "./properties";

export type CSSClassPropertyDefinition = {
  [K in CSSPropertyName]?: CSSPropertyValueTypeForProperty<K>;
};

export type CSSStyleDefinition = Partial<
  Record<CSSClassName, CSSClassPropertyDefinition>
>;
