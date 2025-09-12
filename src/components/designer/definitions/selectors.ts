import type { CSSPropertyName } from "./properties";

export interface CSSSelector {
  /**
   * properties this selector supports
   */
  properties: CSSPropertyName[];

  /**
   * additional selectors that should be generated alongside this selector
   * to account for quirkiness in browsers or microsoft products
   */
  additionalSelectors?: string[];
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
    additionalSelectors: [
      // explicitly define primary and secondary buttons as well, as
      // for some reason they do not inherit from .ext-button on some sign-in pages
      ".ext-button.ext-primary",
      ".ext-button.ext-secondary",
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
