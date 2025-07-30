import type { CSSPropertyName } from "./properties";

export interface CSSSelector {
  displayName: string;
  properties: CSSPropertyName[];
}

const SELECTORS = {
  ".ext-button": {
    displayName: "UI Buttons",
    properties: ["background-color", "border-radius"],
  },
  ".ext-foo": {
    displayName: "Testing",
    properties: ["background-color"],
  },
} satisfies Record<string, CSSSelector>;
export default SELECTORS;

export const ALL_SELECTORS = Object.keys(SELECTORS) as CSSPropertyName[];

export type CSSSelectorName = keyof typeof SELECTORS;
