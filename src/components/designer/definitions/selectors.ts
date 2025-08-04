import type { CSSPropertyName } from "./properties";

export interface CSSSelector {
  properties: CSSPropertyName[];
}

const margins = [
  "margin-top",
  "margin-bottom",
  "margin-right",
  "margin-left",
] as const;

const SELECTORS = {
  "*": {
    properties: ["color", "font-family", "font-weight"],
  },

  //#region form
  ".ext-sign-in-box": {
    properties: ["background-color", "border-radius", ...margins],
  },
  ".ext-banner-logo": {
    properties: [...margins, "background-image"],
  },
  ".ext-title": {
    properties: ["text-align", "font-family", "font-weight", "color"],
  },
  ".ext-input": {
    properties: ["font-family", "font-weight", "color", "border-radius"],
  },
  ".ext-has-error": {
    properties: ["font-family", "font-weight", "color", "border-radius"],
  },
  ".ext-error": {
    properties: ["font-family", "font-weight", "color", "background-color"],
  },
  ".ext-boilerplate-text": {
    properties: [
      "text-align",
      "font-family",
      "font-weight",
      "color",
      "background-color",
    ],
  },
  //#endregion

  //#region buttons
  ".ext-button": {
    properties: [
      "font-family",
      "font-weight",
      "color",
      "color$:hover",
      "background-color",
      "background-color$:hover",
      "border-radius",
    ],
  },
  ".ext-button.ext-primary": {
    properties: [
      "font-family",
      "font-weight",
      "color",
      "color$:hover",
      "background-color",
      "background-color$:hover",
      "border-radius",
    ],
  },
  ".ext-button.ext-secondary": {
    properties: [
      "font-family",
      "font-weight",
      "color",
      "color$:hover",
      "background-color",
      "background-color$:hover",
      "border-radius",
    ],
  },
  //#endregion

  //#region background
  ".ext-background-image": {
    properties: ["background-image"],
  },
  ".ext-background-overlay": {
    properties: ["background-color"],
  },
  //#endregion
} satisfies Record<string, CSSSelector>;
export default SELECTORS;

export const ALL_SELECTORS = Object.keys(SELECTORS) as CSSSelectorName[];

export type CSSSelectorName = keyof typeof SELECTORS;
