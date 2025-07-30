import type { CSSPropertyName } from "./properties";

export interface CSSSelector {
  displayName: string;
  properties: CSSPropertyName[];
}

const SELECTORS = {
  ".ext-button": {
    displayName: "UI Buttons",
    properties: ["color", "background-color", "border-radius"],
  },
  ".ext-boilerplate-text": {
    displayName: "Boilerplate Text",
    properties: ["color", "background-color", "text-align"],
  },
  ".ext-title": {
    displayName: "Title",
    properties: ["color", "text-align"],
  },
} satisfies Record<string, CSSSelector>;
export default SELECTORS;

export const ALL_SELECTORS = Object.keys(SELECTORS) as CSSPropertyName[];

export type CSSSelectorName = keyof typeof SELECTORS;
