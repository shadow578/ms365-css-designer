import type { CSSPropertyName } from "./properties";

export interface CSSSelector {
  properties: CSSPropertyName[];
}

const SELECTORS = {
  "*": {
    properties: ["color", "font-family", "font-weight", "font-size"],
  },

  //#region form
  ".ext-sign-in-box": {
    properties: [
      "background-color",
      "border-radius",
      "margin-top",
      "margin-bottom",
      "margin-right",
      "margin-left",
    ],
  },
  ".ext-banner-logo": {
    properties: [
      "background-image",
      "margin-top",
      "margin-bottom",
      "margin-right",
      "margin-left",
    ],
  },
  ".ext-title": {
    properties: [
      "text-align",
      "font-family",
      "font-weight",
      "font-size",
      "color",
      "margin-top",
      "margin-bottom",
    ],
  },
  ".ext-input": {
    properties: [
      "font-family",
      "font-weight",
      "font-size",
      "color",
      "border-radius",
    ],
  },
  ".ext-has-error": {
    properties: [
      "font-family",
      "font-weight",
      "font-size",
      "color",
      "border-radius",
    ],
  },
  ".ext-error": {
    properties: [
      "font-family",
      "font-weight",
      "font-size",
      "color",
      "background-color",
    ],
  },
  ".ext-boilerplate-text": {
    properties: [
      "text-align",
      "font-family",
      "font-weight",
      "font-size",
      "color",
      "background-color",
    ],
  },
  ".ext-promoted-fed-cred-box": {
    properties: [
      "background-color",
      "border-radius",
      "margin-top",
      "margin-bottom",
      "margin-right",
      "margin-left",
    ],
  },
  //#endregion

  //#region buttons
  ".ext-button": {
    properties: [
      "font-family",
      "font-weight",
      "font-size",
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
      "font-size",
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
      "font-size",
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
